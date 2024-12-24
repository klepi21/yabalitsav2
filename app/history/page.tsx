"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { MatchCard } from "@/components/match/match-card";

export default function HistoryPage() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const supabase = createClientComponentClient();

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
        .order('match_date', { ascending: false });

      if (error) {
        console.error('Error fetching matches:', error);
        return;
      }

      setMatches(data || []);
      setLoading(false);
    };

    fetchMatches();
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;

  const upcomingMatches = matches.filter(match => 
    match.participants?.some((p: any) => p.player.id === user?.id)
  );

  const pastMatches = matches.filter(match => 
    match.participants?.some((p: any) => p.player.id === user?.id)
  );

  return (
    <div className="container py-6 space-y-8">
      {/* Upcoming Matches */}
      {upcomingMatches.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Επερχόμενοι Αγώνες</h2>
          <div className="space-y-4">
            {upcomingMatches.map((match) => (
              <MatchCard 
                key={match.id} 
                match={{
                  ...match,
                  venue: match.venue,
                  host: match.host,
                  participants: match.participants
                }}
                isJoined={match.participants?.some((p: any) => p.player.id === user?.id) || false}
                onJoin={() => {}} // Empty function since this is history view
                formatName={(name: string) => {
                  const [firstName, ...lastNames] = name.split(' ');
                  return `${firstName} ${lastNames[0]?.[0]}.`;
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* Past Matches */}
      {pastMatches.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Προηγούμενοι Αγώνες</h2>
          <div className="space-y-4">
            {pastMatches.map((match) => (
              <MatchCard 
                key={match.id} 
                match={{
                  ...match,
                  venue: match.venue,
                  host: match.host,
                  participants: match.participants
                }}
                isJoined={match.participants?.some((p: any) => p.player.id === user?.id) || false}
                onJoin={() => {}} // Empty function since this is history view
                formatName={(name: string) => {
                  const [firstName, ...lastNames] = name.split(' ');
                  return `${firstName} ${lastNames[0]?.[0]}.`;
                }}
              />
            ))}
          </div>
        </section>
      )}

      {matches.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">Δεν έχετε συμμετάσχει σε αγώνες ακόμα</h3>
          <p className="text-muted-foreground">Βρείτε έναν αγώνα και συμμετάσχετε!</p>
        </div>
      )}
    </div>
  );
}