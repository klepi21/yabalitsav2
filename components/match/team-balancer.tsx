"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Profile } from "@/lib/supabase/types";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Shuffle } from "lucide-react";

interface TeamBalancerProps {
  participants: Profile[];
}

export function TeamBalancer({ participants }: TeamBalancerProps) {
  const [teams, setTeams] = useState<{ teamA: Profile[]; teamB: Profile[] } | null>(null);

  const balanceTeams = () => {
    const players = [...participants];
    const teamA: Profile[] = [];
    const teamB: Profile[] = [];
    
    // Randomly shuffle players
    players.sort(() => Math.random() - 0.5);

    // Distribute players evenly
    players.forEach((player, index) => {
      if (index % 2 === 0) {
        teamA.push(player);
      } else {
        teamB.push(player);
      }
    });

    setTeams({ teamA, teamB });
  };

  if (!teams) {
    return (
      <Button 
        onClick={balanceTeams}
        className="w-full mt-4"
        variant="outline"
      >
        <Shuffle className="w-4 h-4 mr-2" />
        Δημιουργία Ομάδων
      </Button>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Team A */}
        <Card className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Ομάδα A</h3>
            <span className="text-sm text-muted-foreground">
              {teams.teamA.length} παίκτες
            </span>
          </div>
          <div className="space-y-2">
            {teams.teamA.map((player) => (
              <div key={player.id} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={player.avatar_url || undefined} />
                  <AvatarFallback>{player.full_name?.[0] || "?"}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">{player.full_name}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Team B */}
        <Card className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Ομάδα B</h3>
            <span className="text-sm text-muted-foreground">
              {teams.teamB.length} παίκτες
            </span>
          </div>
          <div className="space-y-2">
            {teams.teamB.map((player) => (
              <div key={player.id} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={player.avatar_url || undefined} />
                  <AvatarFallback>{player.full_name?.[0] || "?"}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">{player.full_name}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Button 
        onClick={balanceTeams} 
        variant="outline"
        className="w-full"
      >
        <Shuffle className="w-4 h-4 mr-2" />
        Ανακατανομή Ομάδων
      </Button>
    </div>
  );
} 