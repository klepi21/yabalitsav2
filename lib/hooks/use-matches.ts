"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { Match } from "@/lib/supabase/types";

export function useMatches(status?: Match["status"]) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const query = supabase
          .from("matches")
          .select(`
            *,
            venue:venues(*),
            host:profiles(*),
            participants:match_participants(
              player:profiles(*)
            )
          `)
          .order("match_date", { ascending: true });

        if (status) {
          query.eq("status", status);
        }

        const { data, error } = await query;

        if (error) throw error;
        setMatches(data || []);
      } catch (error) {
        console.error("Error fetching matches:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();

    const subscription = supabase
      .channel("matches")
      .on("postgres_changes", { event: "*", schema: "public", table: "matches" }, 
        () => {
          fetchMatches();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [status]);

  return { matches, loading };
}