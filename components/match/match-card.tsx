"use client";

import { format } from "date-fns";
import { MapPin, Users, Clock, Copy, Share2 } from "lucide-react";
import { EuroIcon } from "@/components/icons/euro";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/language-context";
import { formatDateToGreek } from "@/lib/date-utils";
import { formatName } from "@/lib/utils";
import { getTeamSizes } from "@/lib/utils";

interface MatchCardProps {
  match: {
    id: string;
    host_id: string;
    match_date: string;
    max_players: number;
    cost_per_player: number;
    status: string;
    venue?: {
      name: string;
      address: string;
    };
    host?: {
      full_name: string | null;
    };
    participants?: Array<{
      player: {
        id: string;
        full_name: string | null;
      };
    }>;
    is_private: boolean;
    private_code?: string;
  };
}

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
};

export function MatchCard({ match }: MatchCardProps) {
  const { t } = useLanguage();
  const [isJoined, setIsJoined] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClientComponentClient();
  const { toast } = useToast();
  const router = useRouter();
  const [imageError, setImageError] = useState(false);

  const matchDate = new Date(match.match_date);
  const formattedDate = formatDateToGreek(matchDate, "EEEE d MMM");
  const formattedTime = format(matchDate, "HH:mm");
  const participantCount = match.participants?.length || 0;

  useEffect(() => {
    const checkUserStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check if user is host
      setIsHost(match.host_id === user.id);

      // Check if user is already a participant
      setIsJoined(match.participants?.some(p => p.player.id === user.id) || false);
    };

    checkUserStatus();
  }, [match.host_id, match.participants]);

  const handleJoinMatch = async (e: React.MouseEvent) => {
    try {
      e.stopPropagation(); // Prevent card click navigation
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (match.is_private) {
        // For private matches, redirect to match details page
        router.push(`/match/${match.id}`);
        return;
      }

      const { error } = await supabase
        .from('match_participants')
        .insert({
          match_id: match.id,
          player_id: user.id
        });

      if (error) throw error;

      setIsJoined(true);
      toast({
        title: "Success",
        description: "You've joined the match!",
      });
    } catch (error) {
      console.error('Error joining match:', error);
      toast({
        title: "Error",
        description: "Failed to join match",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card 
      className="cursor-pointer transition-all hover:bg-accent/50 hover:scale-[1.02] border-2 
        shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:shadow-[0_0_15px_rgba(255,255,255,0.1)]
        hover:shadow-[0_0_20px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]
        bg-card/50 backdrop-blur-sm"
      onClick={() => router.push(`/match/${match.id}`)}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 
        bg-gradient-to-r from-primary/20 via-primary/10 to-transparent 
        border-b border-border/50">
        <div>
          <h3 className="font-semibold text-lg">{match.venue?.name}</h3>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Users className="h-3 w-3" />
            {t('matches.host')} {formatName(match.host?.full_name)}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          {match.is_private && (
            <Badge variant="secondary">{t('matches.private')}</Badge>
          )}
          {participantCount >= match.max_players ? (
            <Badge variant="destructive">{t('matches.full')}</Badge>
          ) : (
            <Badge variant="outline">{t(`matches.status.${match.status}`)}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 mt-2">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{formattedTime}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <EuroIcon className="h-4 w-4 text-muted-foreground" />
            <span>€{match.cost_per_player}</span>
          </div>
        </div>

        <div className="pt-3 border-t">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-sm font-medium">{t('matches.players')}</span>
              <span className="text-xs text-muted-foreground ml-2">
                ({getTeamSizes(match.max_players)})
              </span>
            </div>
            <span className="text-sm text-muted-foreground">
              {participantCount} / {match.max_players}
            </span>
          </div>
          <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className="absolute inset-y-0 left-0 bg-primary transition-all"
              style={{ width: `${(participantCount / match.max_players) * 100}%` }}
            />
          </div>
        </div>

        {!isHost && !isJoined && participantCount < match.max_players && match.status === 'upcoming' && (
          <Button 
            className="w-full mt-2 bg-primary hover:bg-primary/90 text-white shadow-lg"
            variant="default"
            disabled={loading}
            onClick={handleJoinMatch}
          >
            {match.is_private ? t('matches.details.joinPrivate') : t('matches.join')}
          </Button>
        )}
        {isHost && match.is_private && (
          <div className="mt-2 p-3 bg-muted rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Private Match Code</p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7"
                  onClick={async (e) => {
                    e.stopPropagation();
                    if (!match.private_code) return;
                    const success = await copyToClipboard(match.private_code);
                    if (success) {
                      toast({
                        title: "Copied!",
                        description: "Match code copied to clipboard",
                        duration: 2000, // Show for 2 seconds
                      });
                    } else {
                      toast({
                        title: "Error",
                        description: "Failed to copy code",
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!match.private_code) return;
                    if (navigator.share) {
                      navigator.share({
                        title: 'Join my football match!',
                        text: `Join my match at ${match.venue?.name}! Use code: ${match.private_code}`,
                        url: window.location.href,
                      })
                      .catch((err) => {
                        console.error('Error sharing:', err);
                      });
                    } else {
                      toast({
                        title: "Sharing not supported",
                        description: "Your browser doesn't support sharing",
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  <Share2 className="h-3 w-3 mr-1" />
                  Share
                </Button>
              </div>
            </div>
            <p className="text-base font-mono tracking-wider text-center bg-background rounded p-1">
              {match.private_code}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}