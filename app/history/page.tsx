"use client";

import { useLanguage } from "@/lib/language-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MatchHistoryList } from "@/components/match/match-history-list";
import { useMatches } from "@/lib/hooks/use-matches";
import { MatchCard } from "@/components/match/match-card";

export default function History() {
  const { t } = useLanguage();
  const { matches: hostedMatches, loading: loadingHosted } = useMatches("finished");
  const { matches: upcomingMatches, loading: loadingUpcoming } = useMatches("upcoming");

  return (
    <div className="p-4 space-y-6">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{t('history.title')}</h1>
          <p className="text-muted-foreground">{t('history.subtitle')}</p>
        </div>
      </header>

      <Tabs defaultValue="upcoming">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">{t('history.tabs.upcoming')}</TabsTrigger>
          <TabsTrigger value="finished">{t('history.tabs.finished')}</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
          {upcomingMatches.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              {t('history.noMatches')}
            </p>
          ) : (
            <div className="space-y-4">
              {upcomingMatches.map((match) => (
                <MatchCard 
                  key={match.id} 
                  match={{
                    ...match,
                    participants: match.participants?.map(participant => ({
                      player: {
                        id: participant.id,
                        full_name: participant.full_name
                      }
                    }))
                  }}
                />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="finished">
          {hostedMatches.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              {t('history.noMatches')}
            </p>
          ) : (
            <div className="space-y-4">
              {hostedMatches.map((match) => (
                <MatchCard 
                  key={match.id} 
                  match={{
                    ...match,
                    participants: match.participants?.map(participant => ({
                      player: {
                        id: participant.id,
                        full_name: participant.full_name
                      }
                    }))
                  }}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}