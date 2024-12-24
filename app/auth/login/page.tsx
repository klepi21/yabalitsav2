"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Calendar, MapPin } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { SplineBackground } from "@/components/ui/spline-background";

export default function Login() {
  const supabase = createClientComponentClient();
  const { t } = useLanguage();

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://yabalitsav2.vercel.app/auth/callback',
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6 pb-2 text-center">
        <div className="space-y-6 max-w-2xl">
          <div className="flex flex-col items-center">
            <SplineBackground />
            <h1 className="text-4xl font-black tracking-tight mt-4">
              {t('auth.loginTitle')}
              <br />
              <span className="text-primary">{t('auth.loginSubtitle')}</span>
            </h1>
          </div>
          <p className="text-xl text-muted-foreground">
            {t('auth.loginDescription')}
          </p>
          <div className="flex justify-center pb-4">
            <Button 
              size="lg"
              className="text-lg px-8 py-6 shadow-lg flex items-center gap-3"
              onClick={handleLogin}
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              {t('auth.connectWithGoogle')}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-muted/50">
        <div className="flex flex-col items-center text-center p-4 space-y-2">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <MapPin className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold">{t('auth.features.findMatches.title')}</h3>
          <p className="text-sm text-muted-foreground">
            {t('auth.features.findMatches.description')}
          </p>
        </div>

        <div className="flex flex-col items-center text-center p-4 space-y-2">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold">{t('auth.features.joinTeams.title')}</h3>
          <p className="text-sm text-muted-foreground">
            {t('auth.features.joinTeams.description')}
          </p>
        </div>

        <div className="flex flex-col items-center text-center p-4 space-y-2">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Calendar className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold">{t('auth.features.organizeGames.title')}</h3>
          <p className="text-sm text-muted-foreground">
            {t('auth.features.organizeGames.description')}
          </p>
        </div>

        <div className="flex flex-col items-center text-center p-4 space-y-2">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Trophy className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold">{t('auth.features.ratePlayers.title')}</h3>
          <p className="text-sm text-muted-foreground">
            {t('auth.features.ratePlayers.description')}
          </p>
        </div>
      </div>

      <div className="py-6 text-center text-sm text-muted-foreground bg-background">
        <p>{t('footer.joinCommunity')}</p>
      </div>
    </div>
  );
}