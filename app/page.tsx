"use client";

import { MatchCard } from "@/components/match/match-card";
import { useMatches } from "@/lib/hooks/use-matches";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/language-context";

export default function Home() {
  const [matches, setMatches] = useState<any[]>([]);
  const supabase = createClientComponentClient();
  const { t } = useLanguage();

  useEffect(() => {
    const fetchMatches = async () => {
      const now = new Date().toISOString();
      
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
        .neq('status', 'finished')
        .order('match_date', { ascending: true });

      if (error) {
        console.error('Error fetching matches:', error);
        return;
      }

      setMatches(data || []);
    };

    fetchMatches();
  }, []);

  return (
    <div className="p-4 space-y-6">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{t('matches.title')}</h1>
          <p className="text-muted-foreground">{t('matches.subtitle')}</p>
        </div>
      </header>

      <div className="space-y-4">
        {matches.length === 0 ? (
          <p>No matches available</p>
        ) : (
          matches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
            />
          ))
        )}
      </div>
    </div>
  );
}