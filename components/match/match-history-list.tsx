"use client";

import { Match } from "@/lib/supabase/types";
import { MatchHistoryCard } from "./match-history-card";
import { Skeleton } from "@/components/ui/skeleton";

interface MatchHistoryListProps {
  matches: Match[];
  loading: boolean;
  emptyMessage: string;
  showRating?: boolean;
}

export function MatchHistoryList({
  matches,
  loading,
  emptyMessage,
  showRating,
}: MatchHistoryListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  if (!matches.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {matches.map((match) => (
        <MatchHistoryCard 
          key={match.id} 
          match={match}
          showRating={showRating}
        />
      ))}
    </div>
  );
}