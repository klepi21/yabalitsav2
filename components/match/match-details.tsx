"use client";

import { useState } from "react";
import { format } from "date-fns";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Users, Clock, DollarSign } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface MatchDetailsProps {
  match: Match;
}

export function MatchDetails({ match }: MatchDetailsProps) {
  const [joining, setJoining] = useState(false);
  const { toast } = useToast();
  const formattedDate = format(new Date(match.match_date), "PPp");
  const participantCount = match.participants?.length || 0;

  const handleJoinMatch = async () => {
    try {
      setJoining(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("match_participants")
        .insert({
          match_id: match.id,
          player_id: user.id,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "You have joined the match!",
      });
    } catch (error) {
      console.error("Error joining match:", error);
      toast({
        title: "Error",
        description: "Failed to join the match",
        variant: "destructive",
      });
    } finally {
      setJoining(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{match.venue?.name}</CardTitle>
          <Badge>{match.status}</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-2" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center text-sm">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{match.venue?.address}</span>
          </div>
          <div className="flex items-center text-sm">
            <Users className="h-4 w-4 mr-2" />
            <span>{participantCount} / {match.max_players} players</span>
          </div>
          <div className="flex items-center text-sm">
            <DollarSign className="h-4 w-4 mr-2" />
            <span>${match.cost_per_player} per player</span>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Players</h3>
          <div className="flex flex-wrap gap-2">
            {match.participants?.map((participant) => (
              <div key={participant.id} className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={participant.avatar_url || undefined} />
                  <AvatarFallback>
                    {participant.full_name?.[0] || "?"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{participant.full_name}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        {match.status === "upcoming" && (
          <Button
            className="w-full"
            onClick={handleJoinMatch}
            disabled={joining || participantCount >= match.max_players}
          >
            {joining ? "Joining..." : "Join Match"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}