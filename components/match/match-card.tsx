"use client";

import { format } from "date-fns";
import { MapPin, Users, Clock, ArrowRight } from "lucide-react";
import { EuroIcon } from "@/components/icons/euro";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MatchCardProps {
  match: any;
  isJoined: boolean;
  onJoin: () => void;
  formatName: (name: string) => string;
}

export function MatchCard({ match, isJoined, formatName }: MatchCardProps) {
  const formattedTime = format(new Date(match.match_date), "HH:mm");
  const participantCount = match.participants?.length || 0;
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/match/${match.id}`);
  };

  return (
    <Card 
      className="group hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer" 
      onClick={handleCardClick}
    >
      {/* Stylized Field Pattern Cover */}
      <div className="relative h-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10">
          {/* Field Lines Pattern */}
          <div className="absolute inset-0" style={{ 
            backgroundImage: `
              linear-gradient(to right, transparent 49%, rgba(255,255,255,0.1) 50%, transparent 51%),
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            opacity: 0.3
          }} />
          {/* Center Circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-2 border-white/20 rounded-full" />
          {/* Penalty Areas */}
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-12 h-24 border-2 border-white/20" />
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-12 h-24 border-2 border-white/20" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
          <div>
            <h3 className="text-lg font-bold text-foreground">{match.venue.name}</h3>
            <p className="text-sm text-muted-foreground">{format(new Date(match.match_date), "EEEE d MMM")}</p>
          </div>
          <Badge variant={match.status === 'upcoming' ? 'secondary' : 'outline'}>
            {match.status === 'upcoming' ? 'Επερχόμενο' : match.status}
          </Badge>
        </div>
      </div>

      <CardContent className="pt-4">
        {/* Quick Info Row */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="flex flex-col items-center p-2 bg-muted/50 rounded-lg">
            <Clock className="h-4 w-4 mb-1 text-primary" />
            <span className="text-sm font-medium">{formattedTime}</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-muted/50 rounded-lg">
            <Users className="h-4 w-4 mb-1 text-primary" />
            <span className="text-sm font-medium">{participantCount}/{match.max_players}</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-muted/50 rounded-lg">
            <EuroIcon className="h-4 w-4 mb-1 text-primary" />
            <span className="text-sm font-medium">{match.cost_per_player}€</span>
          </div>
        </div>

        {/* Host Info */}
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-8 w-8 border-2 border-primary">
            <AvatarImage src={match.host.avatar_url} />
            <AvatarFallback>{match.host.full_name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{formatName(match.host.full_name)}</p>
            <p className="text-xs text-muted-foreground">Διοργανωτής</p>
          </div>
        </div>

        {/* Location Preview */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <MapPin className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">{match.venue.address}</span>
        </div>

        {/* See More Button */}
        <Button 
          className="w-full group-hover:bg-primary transition-colors"
          variant="default"
        >
          Περισσότερες πληροφορίες
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}