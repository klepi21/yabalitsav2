"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { Match } from "@/lib/supabase/types";

export function useMatch(matchId: string) {
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const { data, error } = await supabase
          .from("matches")
          .select(`
            *,
            venue:venues(*),
            host:profiles!matches_host_id_fkey(*),
            participants:match_participants(profiles(*))
          `)
          .eq("id", matchId)
          .single();

        if (error) throw error;
        setMatch(data);
      } catch (error) {
        console.error("Error fetching match:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatch();

    const subscription = supabase
      .channel(`match-${matchId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "matches", filter: `id=eq.${matchId}` },
        () => {
          fetchMatch();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [matchId]);

  return { match, loading };
}