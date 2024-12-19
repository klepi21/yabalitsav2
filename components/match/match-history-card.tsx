"use client";

import { format } from "date-fns";
import Link from "next/link";
import { Match } from "@/lib/supabase/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Star } from "lucide-react";

interface MatchHistoryCardProps {
  match: Match;
  showRating?: boolean;
}

export function MatchHistoryCard({ match, showRating }: MatchHistoryCardProps) {
  const formattedDate = format(new Date(match.match_date), "PPp");
  const participantCount = match.participants?.length || 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{match.venue?.name}</CardTitle>
          <Badge variant={match.status === "finished" ? "secondary" : "default"}>
            {match.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-2">
        <div className="flex items-center text-sm">
          <MapPin className="h-4 w-4 mr-2" />
          <span>{match.venue?.address}</span>
        </div>
        <div className="flex items-center text-sm">
          <Users className="h-4 w-4 mr-2" />
          <span>{participantCount} / {match.max_players} players</span>
        </div>
        {showRating && (
          <div className="flex items-center text-sm">
            <Star className="h-4 w-4 mr-2" />
            <span>Rate players and vote MVP</span>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/match/${match.id}`}>
            {showRating ? "Rate Match" : "View Details"}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}