"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { MapPin, Users, Clock, Phone, Copy, Share2 } from "lucide-react";
import { EuroIcon } from "@/components/icons/euro";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { addHours, isBefore } from "date-fns";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { PlayerRating } from "@/components/match/player-rating";
import { RatingDisplay } from "@/components/ui/rating-display";
import { FieldCover } from "@/components/match/field-cover";
import { useLanguage } from "@/lib/language-context";
import { formatDateToGreek } from "@/lib/date-utils";
import { MatchChat } from "@/components/match/match-chat";

export default function MatchDetails({ params }: { params: { id: string } }) {
  const [match, setMatch] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isJoined, setIsJoined] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [showRatings, setShowRatings] = useState(false);
  const supabase = createClientComponentClient();
  const { toast } = useToast();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [communityRatings, setCommunityRatings] = useState<{[key: string]: number}>({});
  const { t } = useLanguage();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const fetchMatch = async () => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) return;

      const { data, error } = await supabase
        .from("matches")
        .select(`
          *,
          venue:venues(*),
          host:profiles!matches_host_id_fkey(*),
          participants:match_participants(
            player:profiles(*)
          ),
          match_ratings(*)
        `)
        .eq('id', params.id)
        .single();

      if (error) throw error;
      setMatch(data);

      // Update isHost and isJoined states
      setIsHost(data.host_id === currentUser.id);
      setIsJoined(data.participants.some((p: any) => p.player.id === currentUser.id));

      // Fetch all community ratings at once
      const playerIds = data.participants.map((p: any) => p.player.id);
      const { data: ratings } = await supabase
        .from('match_ratings')
        .select('rating, rated_player_id')
        .in('rated_player_id', playerIds);

      // Calculate average ratings
      const ratingsByPlayer: {[key: string]: number[]} = {};
      ratings?.forEach((r: any) => {
        if (!ratingsByPlayer[r.rated_player_id]) {
          ratingsByPlayer[r.rated_player_id] = [];
        }
        ratingsByPlayer[r.rated_player_id].push(r.rating);
      });

      // Calculate averages
      const averageRatings: {[key: string]: number} = {};
      Object.entries(ratingsByPlayer).forEach(([playerId, ratings]) => {
        const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
        averageRatings[playerId] = Number(avg.toFixed(1));
      });

      setCommunityRatings(averageRatings);
    } catch (error) {
      console.error('Error fetching match:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMatch();
    }
  }, [params.id, user]);

  const handleCancelParticipation = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const matchDate = new Date(match.match_date);
      const cancelDeadline = addHours(matchDate, -8);
      const now = new Date();

      if (!isBefore(now, cancelDeadline)) {
        toast({
          title: "Cannot Cancel",
          description: "Cancellations are only allowed up to 8 hours before the match",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('match_participants')
        .delete()
        .match({ 
          match_id: match.id, 
          player_id: user.id 
        });

      if (error) throw error;

      setIsJoined(false);
      toast({
        title: "Success",
        description: "You've cancelled your participation",
      });

      // Refresh match data
      const { data: updatedMatch, error: fetchError } = await supabase
        .from("matches")
        .select(`
          *,
          venue:venues(*),
          host:profiles!matches_host_id_fkey(*),
          participants:match_participants(
            player:profiles(
              id,
              full_name,
              phone_number,
              phone_public,
              avatar_url
            )
          )
        `)
        .eq('id', params.id)
        .single();

      if (fetchError) throw fetchError;
      setMatch(updatedMatch);

    } catch (error) {
      console.error('Error cancelling participation:', error);
      toast({
        title: "Error",
        description: "Failed to cancel participation",
        variant: "destructive",
      });
    }
  };

  const handleJoinPrivateMatch = async () => {
    try {
      if (match.private_code !== joinCode) {
        toast({
          title: "Invalid Code",
          description: "The code you entered is incorrect",
          variant: "destructive",
        });
        return;
      }
      
      // Proceed with joining the match
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('match_participants')
        .insert({
          match_id: match.id,
          player_id: user.id
        });

      if (error) throw error;

      setIsJoined(true);
      setShowCodeInput(false);
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
    }
  };

  const canDeleteMatch = (participantCount: number, maxPlayers: number) => {
    return (participantCount / maxPlayers) < 0.9; // Less than 90% filled
  };

  const handleDeleteMatch = async () => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to delete this match? This action cannot be undone."
      );

      if (!confirmed) return;

      // First delete all participants
      const { error: participantsError } = await supabase
        .from('match_participants')
        .delete()
        .eq('match_id', match.id);

      if (participantsError) throw participantsError;

      // Then delete the match
      const { error: matchError } = await supabase
        .from('matches')
        .delete()
        .eq('id', match.id);

      if (matchError) throw matchError;

      toast({
        title: "Success",
        description: "Match has been deleted",
      });

      router.push('/'); // Redirect to home page
    } catch (error) {
      console.error('Error deleting match:', error);
      toast({
        title: "Error",
        description: "Failed to delete match",
        variant: "destructive",
      });
    }
  };

  const handleFinishMatch = async () => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to mark this match as finished?"
      );

      if (!confirmed) return;

      const { error: chatError } = await supabase
        .from('match_chat')
        .delete()
        .eq('match_id', match.id);

      if (chatError) {
        console.error('Error deleting chat messages:', chatError);
      }

      const { error } = await supabase
        .from('matches')
        .update({ status: 'finished' })
        .eq('id', match.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Match has been marked as finished",
      });

      await fetchMatch();
    } catch (error) {
      console.error('Error finishing match:', error);
      toast({
        title: "Error",
        description: "Failed to finish match",
        variant: "destructive",
      });
    }
  };

  const fetchCommunityRating = async (supabase: any, playerId: string) => {
    const { data: ratings } = await supabase
      .from('match_ratings')
      .select('rating')
      .eq('rated_player_id', playerId);

    if (ratings && ratings.length > 0) {
      const avgRating = ratings.reduce((acc: number, curr: any) => acc + curr.rating, 0) / ratings.length;
      return Number(avgRating.toFixed(1));
    }
    return null;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error('Failed to copy text: ', err);
      return false;
    }
  };

  const handleJoinMatch = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('match_participants')
        .insert({
          match_id: match.id,
          player_id: user.id
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "You've joined the match!",
      });

      // Refresh match data
      fetchMatch();
    } catch (error) {
      console.error('Error joining match:', error);
      toast({
        title: "Error",
        description: "Failed to join match",
        variant: "destructive",
      });
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (!match) return <div className="p-4">Match not found</div>;

  const matchDate = new Date(match.match_date);
  const formattedDate = formatDateToGreek(matchDate, "EEEE d MMM");
  const formattedTime = format(matchDate, "HH:mm");
  const participantCount = match.participants?.length || 0;

  const cancelDeadline = addHours(matchDate, -8);
  const canCancel = isBefore(new Date(), cancelDeadline);

  // Helper function to format name
  const formatName = (fullName: string) => {
    const [firstName, ...lastNames] = fullName.split(' ');
    return `${firstName} ${lastNames.map(name => name[0]).join('. ')}.`;
  };

  // Helper function to calculate rating
  const calculateRating = (player: any) => {
    if (!player.speed || !player.pace || !player.power) return null;
    return ((player.speed + player.pace + player.power) / 3).toFixed(1);
  };

  return (
    <div className="p-4 space-y-6">
      <Card className="border-none shadow-none">
        <FieldCover className="rounded-t-lg" />
        <CardHeader className="flex flex-row items-center justify-between pb-2 px-4 -mt-8 relative z-10">
          <div className="bg-background p-4 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold">{match.venue.name}</h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              {t('matches.host')} {match.host.full_name}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2 bg-background p-4 rounded-lg shadow-lg">
            {match.is_private && (
              <Badge variant="secondary">{t('matches.private')}</Badge>
            )}
            <Badge variant="outline">{t(`matches.status.${match.status}`)}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-8 px-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border space-y-1">
              <p className="text-sm text-muted-foreground">{t('matches.date')}</p>
              <p className="font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {formattedDate}
              </p>
            </div>
            <div className="p-4 rounded-lg border space-y-1">
              <p className="text-sm text-muted-foreground">{t('matches.time')}</p>
              <p className="font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {formattedTime}
              </p>
            </div>
            <div className="p-4 rounded-lg border space-y-1">
              <p className="text-sm text-muted-foreground">{t('matches.details.costPerPlayer')}</p>
              <p className="font-medium flex items-center gap-2">
                <EuroIcon className="h-4 w-4" />
                €{match.cost_per_player}
              </p>
            </div>
            <div className="p-4 rounded-lg border space-y-1">
              <p className="text-sm text-muted-foreground">{t('matches.players')}</p>
              <p className="font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                {participantCount} / {match.max_players}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">{t('matches.details.location')}</h2>
              <a 
                href={`https://maps.google.com/?q=${match.venue.address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                {t('matches.details.openInMaps')}
              </a>
            </div>
            <div className="p-4 rounded-lg border">
              <p className="font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {match.venue.address}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Players</h2>
            <div className="grid gap-3">
              {match.participants.map((participant: any) => {
                const selfRating = participant.player.speed && participant.player.pace && participant.player.power
                  ? ((participant.player.speed + participant.player.pace + participant.player.power) / 3).toFixed(1)
                  : null;
                const communityRating = communityRatings[participant.player.id];

                return (
                  <div 
                    key={participant.player.id} 
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="flex gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={participant.player.avatar_url} />
                        <AvatarFallback>{participant.player.full_name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {formatName(participant.player.full_name)}
                          </span>
                          {participant.player.id === match.host_id && (
                            <Badge variant="outline">Host</Badge>
                          )}
                        </div>
                        
                        <div className="flex gap-3 items-center">
                          {selfRating && (
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-muted-foreground">Self:</span>
                              <Badge variant="secondary" className="text-xs">{selfRating}</Badge>
                            </div>
                          )}
                          {communityRating && (
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-muted-foreground">Community:</span>
                              <RatingDisplay rating={communityRating} size="sm" showValue={false} />
                            </div>
                          )}
                        </div>

                        {isHost && participant.player.phone_public && participant.player.phone_number && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {participant.player.phone_number}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {!isHost && match.status !== 'finished' && (
            <>
              {!isJoined && participantCount < match.max_players && (
                <>
                  {match.is_private && !showCodeInput ? (
                    <Button 
                      className="w-full" 
                      onClick={() => setShowCodeInput(true)}
                    >
                      {t('matches.details.joinPrivate')}
                    </Button>
                  ) : match.is_private && showCodeInput ? (
                    <div className="space-y-2">
                      <Input
                        type="text"
                        placeholder={t('matches.details.enterCode')}
                        maxLength={6}
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <Button 
                          className="flex-1"
                          onClick={handleJoinPrivateMatch}
                        >
                          {t('matches.details.submitCode')}
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => {
                            setShowCodeInput(false);
                            setJoinCode('');
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button className="w-full" onClick={handleJoinMatch}>
                      Join Match
                    </Button>
                  )}
                </>
              )}
              {isJoined && (
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={handleCancelParticipation}
                  disabled={!canCancel}
                >
                  {canCancel ? t('matches.details.cancelParticipation') : t('matches.details.cannotCancel')}
                </Button>
              )}
            </>
          )}

          {isHost && match.status !== 'finished' && canDeleteMatch(participantCount, match.max_players) && (
            <div className="mt-6 pt-6 border-t">
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={handleDeleteMatch}
              >
                {t('matches.details.deleteMatch')}
              </Button>
              <p className="text-sm text-muted-foreground mt-2 text-center">
                {t('matches.details.deleteWarning')}
              </p>
            </div>
          )}

          {isHost && match.status === 'upcoming' && (
            <Button 
              className="w-full mt-4"
              onClick={handleFinishMatch}
            >
              {t('matches.details.markAsFinished')}
            </Button>
          )}

          {match.status === 'finished' && user && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Rate Players</h2>
                <Button
                  variant="outline"
                  onClick={() => setShowRatings(!showRatings)}
                >
                  {showRatings ? 'Hide Ratings' : 'Show Ratings'}
                </Button>
              </div>
              
              {showRatings && (
                <div className="space-y-3">
                  {match.participants
                    .filter((p: any) => p.player.id !== user.id)
                    .map((participant: any) => {
                      const existingRating = match.match_ratings?.find(
                        (r: any) => r.rater_id === user.id && r.rated_player_id === participant.player.id
                      )?.rating;

                      return (
                        <PlayerRating
                          key={participant.player.id}
                          matchId={match.id}
                          playerId={participant.player.id}
                          playerName={participant.player.full_name}
                          existingRating={existingRating}
                          onRated={fetchMatch}
                        />
                      );
                    })}
                </div>
              )}
            </div>
          )}

          {isHost && match.is_private && match.status !== 'finished' && (
            <div className="mt-2 p-4 bg-muted rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{t('matches.details.privateCode')}</p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8"
                    onClick={async () => {
                      const success = await copyToClipboard(match.private_code);
                      if (success) {
                        toast({
                          title: "Copied!",
                          description: "Match code copied to clipboard",
                        });
                      }
                    }}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    {t('matches.details.copyCode')}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: 'Join my football match!',
                          text: `Join my match at ${match.venue.name}! Use code: ${match.private_code}`,
                          url: window.location.href,
                        }).catch((err) => {
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
                    <Share2 className="h-4 w-4 mr-1" />
                    {t('matches.details.share')}
                  </Button>
                </div>
              </div>
              <p className="text-lg font-mono tracking-wider text-center bg-background rounded p-2">
                {match.private_code}
              </p>
            </div>
          )}

          {isJoined && match.status !== 'finished' && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Match Chat</h3>
              <MatchChat matchId={match.id} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}