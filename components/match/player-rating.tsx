"use client";

import { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useToast } from "@/hooks/use-toast";

interface PlayerRatingProps {
  matchId: string;
  playerId: string;
  playerName: string;
  existingRating?: number;
  onRated?: () => void;
}

export function PlayerRating({ matchId, playerId, playerName, existingRating, onRated }: PlayerRatingProps) {
  const [rating, setRating] = useState(existingRating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  const handleRate = async () => {
    try {
      setIsSubmitting(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('match_ratings')
        .upsert({
          match_id: matchId,
          rated_player_id: playerId,
          rater_id: user.id,
          rating: rating
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Rating submitted successfully",
      });

      onRated?.();
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast({
        title: "Error",
        description: "Failed to submit rating",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 rounded-lg border">
      <div>
        <p className="font-medium">{playerName}</p>
        <div className="flex gap-1 mt-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              className="focus:outline-none"
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => setRating(star)}
            >
              <Star
                className={`h-6 w-6 ${
                  star <= (hoveredRating || rating)
                    ? 'fill-primary text-primary'
                    : 'text-muted-foreground'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
      <Button
        size="sm"
        disabled={!rating || isSubmitting}
        onClick={handleRate}
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </Button>
    </div>
  );
} 