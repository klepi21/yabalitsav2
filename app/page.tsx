"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { MatchCard } from "@/components/match/match-card";
import { useRouter } from "next/navigation";

export default function Home() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  useEffect(() => {
    const fetchMatches = async () => {
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          venue:venues(*),
          host:profiles!matches_host_id_fkey(*),
          participants:match_participants(
            player:profiles(*)
          )
        `)
        .eq('status', 'upcoming')
        .order('match_date', { ascending: true })
        .limit(3);

      if (error) {
        console.error('Error fetching matches:', error);
        return;
      }

      setMatches(data || []);
      setLoading(false);
    };

    fetchMatches();
  }, []);

  const handleJoinMatch = async (matchId: string) => {
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      const { error } = await supabase
        .from('match_participants')
        .insert({
          match_id: matchId,
          player_id: user.id
        });

      if (error) throw error;

      router.refresh();
    } catch (error) {
      console.error('Error joining match:', error);
    }
  };

  const formatName = (fullName: string) => {
    const [firstName, ...lastNames] = fullName.split(' ');
    return `${firstName} ${lastNames[0]?.[0]}.`;
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <main className="container py-6">
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Επερχόμενοι Αγώνες</h2>
          <button 
            onClick={() => router.push('/matches')}
            className="text-primary hover:underline"
          >
            Δείτε όλους
          </button>
        </div>
        {matches.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">Δεν υπάρχουν διαθέσιμοι αγώνες</h3>
            <p className="text-muted-foreground">Δοκιμάστε ξανά αργότερα</p>
          </div>
        ) : (
          matches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              isJoined={match.participants?.some((p: any) => p.player.id === user?.id) || false}
              onJoin={() => handleJoinMatch(match.id)}
              formatName={formatName}
            />
          ))
        )}
      </section>
    </main>
  );
}