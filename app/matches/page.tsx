"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { MatchCard } from "@/components/match/match-card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import { AuthCheck } from "@/components/auth-check";

export default function MatchesPage() {
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
        .order('match_date', { ascending: true });

      if (error) {
        console.error('Error fetching matches:', error);
        return;
      }

      setMatches(data || []);
      setLoading(false);
    };

    fetchMatches();
  }, []);

  const formatName = (fullName: string) => {
    const [firstName, ...lastNames] = fullName.split(' ');
    return `${firstName} ${lastNames[0]?.[0]}.`;
  };

  const handleJoinMatch = async (matchId: string) => {
    try {
      const { error } = await supabase
        .from('match_participants')
        .insert({
          match_id: matchId,
          player_id: user.id
        });

      if (error) throw error;

      // Refresh matches
      router.refresh();
    } catch (error) {
      console.error('Error joining match:', error);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  const todayMatches = matches.filter(match => {
    const matchDate = new Date(match.match_date);
    const today = new Date();
    return matchDate.toDateString() === today.toDateString();
  });

  const upcomingMatches = matches.filter(match => {
    const matchDate = new Date(match.match_date);
    const today = new Date();
    return matchDate > today && matchDate.toDateString() !== today.toDateString();
  });

  return (
    <AuthCheck>
      <div className="container py-6 space-y-8">
        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button variant="outline" size="sm" className="rounded-full">
            <Calendar className="h-4 w-4 mr-2" />
            Σήμερα
          </Button>
          <Button variant="outline" size="sm" className="rounded-full ml-auto">
            <Filter className="h-4 w-4 mr-2" />
            Φίλτρα
          </Button>
        </div>

        {/* Today's Matches */}
        {todayMatches.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Σημερινοί Αγώνες</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {todayMatches.map(match => (
                <MatchCard
                  key={match.id}
                  match={match}
                  isJoined={match.participants.some((p: any) => p.player.id === user?.id)}
                  onJoin={() => handleJoinMatch(match.id)}
                  formatName={formatName}
                />
              ))}
            </div>
          </section>
        )}

        {/* Upcoming Matches */}
        {upcomingMatches.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Προσεχείς Αγώνες</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingMatches.map(match => (
                <MatchCard
                  key={match.id}
                  match={match}
                  isJoined={match.participants.some((p: any) => p.player.id === user?.id)}
                  onJoin={() => handleJoinMatch(match.id)}
                  formatName={formatName}
                />
              ))}
            </div>
          </section>
        )}

        {matches.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">Δεν υπάρχουν διαθέσιμοι αγώνες</h3>
            <p className="text-muted-foreground">Δοκιμάστε να αλλάξετε τα φίλτρα αναζήτησης</p>
          </div>
        )}
      </div>
    </AuthCheck>
  );
} 