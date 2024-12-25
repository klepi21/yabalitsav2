"use client";

import { Star, Trophy, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

interface ProfileCardProps {
  user: any;
  stats: {
    gamesPlayed: number;
    selfRating: number;
    communityRating: number;
  };
  onEdit: () => void;
}

export function ProfileCard({ user, stats, onEdit }: ProfileCardProps) {
  return (
    <Card className="w-full overflow-hidden">
      {/* Cover Image / Gradient */}
      <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5">
        <div className="absolute inset-0" style={{ 
          backgroundImage: `
            linear-gradient(to right, transparent 49%, rgba(255,255,255,0.1) 50%, transparent 51%),
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          opacity: 0.3
        }} />
      </div>

      <CardContent className="relative px-6 pb-6">
        {/* Profile Picture */}
        <div className="absolute -top-16 left-6 flex items-end gap-4">
          <Avatar className="h-32 w-32 border-4 border-background">
            <AvatarImage src={user?.avatar_url} />
            <AvatarFallback className="text-4xl">{user?.full_name?.[0]}</AvatarFallback>
          </Avatar>
          <div className="mb-2">
            <h2 className="text-2xl font-bold">{user?.full_name}</h2>
            <p className="text-muted-foreground">Μέλος από {new Date(user?.created_at).toLocaleDateString('el')}</p>
          </div>
        </div>

        {/* Edit Button */}
        <div className="flex justify-end mb-16">
          <Button variant="outline" onClick={onEdit}>
            Επεξεργασία προφίλ
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
            <Trophy className="h-5 w-5 mb-2 text-primary" />
            <span className="text-2xl font-bold">{stats.gamesPlayed}</span>
            <span className="text-sm text-muted-foreground">Συμμετοχές</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
            <Star className="h-5 w-5 mb-2 text-primary" />
            <span className="text-2xl font-bold">{stats.selfRating.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">Αυτοαξιολόγηση</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
            <Users className="h-5 w-5 mb-2 text-primary" />
            <span className="text-2xl font-bold">{stats.communityRating.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">Κοινότητα</span>
          </div>
        </div>

        {/* Basic Info */}
        <div className="mt-6 space-y-2">
          <div className="flex justify-between py-2 border-b">
            <span className="text-muted-foreground">Email</span>
            <span>{user?.email}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-muted-foreground">Τηλέφωνο</span>
            <span>{user?.phone_number || '-'}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-muted-foreground">Θέση</span>
            <span>{user?.position || '-'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 