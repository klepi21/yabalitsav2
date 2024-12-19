"use client";

import { useState } from "react";
import { Match } from "@/lib/supabase/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface MatchRatingProps {
  match: Match;
}

export function MatchRating({ match }: MatchRatingProps) {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [mvp, setMvp] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmitRatings = async () => {
    try {
      setSubmitting(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const ratingPromises = Object.entries(ratings).map(([playerId, rating]) =>
        supabase.from("match_ratings").insert({
          match_id: match.id,
          rated_by: user.id,
          rated_player: playerId,
          rating,
          is_mvp: playerId === mvp,
        })
      );

      await Promise.all(ratingPromises);

      toast({
        title: "Success",
        description: "Ratings submitted successfully!",
      });
    } catch (error) {
      console.error("Error submitting ratings:", error);
      toast({
        title: "Error",
        description: "Failed to submit ratings",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rate Players</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {match.participants?.map((player) => (
            <div key={player.id} className="space-y-2">
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={player.avatar_url || undefined} />
                  <AvatarFallback>{player.full_name?.[0] || "?"}</AvatarFallback>
                </Avatar>
                <span>{player.full_name}</span>
              </div>
              
              <Slider
                value={[ratings[player.id] || 5]}
                min={1}
                max={10}
                step={1}
                onValueChange={([value]) => 
                  setRatings(prev => ({ ...prev, [player.id]: value }))
                }
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1</span>
                <span>10</span>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <Label>Vote for MVP</Label>
          <RadioGroup value={mvp || ""} onValueChange={setMvp}>
            {match.participants?.map((player) => (
              <div key={player.id} className="flex items-center space-x-2">
                <RadioGroupItem value={player.id} id={`mvp-${player.id}`} />
                <Label htmlFor={`mvp-${player.id}`}>{player.full_name}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <Button
          className="w-full"
          onClick={handleSubmitRatings}
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit Ratings"}
        </Button>
      </CardContent>
    </Card>
  );
}