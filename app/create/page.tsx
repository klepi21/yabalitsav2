"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format, isBefore, startOfToday } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { SoccerBall } from "@/components/icons/soccer-ball";
import { useLanguage } from "@/lib/language-context";
import { Phone } from "lucide-react";

export default function CreateMatch() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [venues, setVenues] = useState<any[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<any>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchVenues = async () => {
      const { data, error } = await supabase
        .from('venues')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching venues:', error);
        return;
      }

      setVenues(data || []);
    };

    fetchVenues();
  }, [supabase]);

  const formSchema = z.object({
    venue_id: z.string({
      required_error: t('create.errors.venueRequired'),
    }),
    match_date: z.date({
      required_error: t('create.errors.dateRequired'),
    }).refine(
      (date) => !isBefore(date, startOfToday()),
      t('create.errors.dateInPast')
    ),
    match_time: z.string().refine(
      (time) => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours >= 10 && hours <= 23 && (minutes === 0 || minutes === 30);
      },
      t('create.errors.timeInvalid')
    ),
    max_players: z.number()
      .min(10, t('create.errors.playersRange'))
      .max(16, t('create.errors.playersRange')),
    cost_per_player: z.number().min(0, t('create.errors.costNegative')),
    is_private: z.boolean().default(false),
    venue_confirmed: z.boolean().refine((val) => val === true, {
      message: t('create.errors.venueConfirmRequired')
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      max_players: 10,
      cost_per_player: 5,
      is_private: false,
      venue_confirmed: false,
    },
  });

  // Generate time options (10:00 to 23:00, every 30 minutes)
  const timeOptions = Array.from({ length: 27 }, (_, i) => {
    const hour = Math.floor(i / 2) + 10;
    const minute = i % 2 === 0 ? "00" : "30";
    return `${hour.toString().padStart(2, '0')}:${minute}`;
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      const supabase = createClientComponentClient();
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to create a match",
          variant: "destructive",
        });
        return;
      }

      // Combine date and time
      const [hours, minutes] = values.match_time.split(':').map(Number);
      const matchDate = new Date(values.match_date);
      matchDate.setHours(hours, minutes);

      // Generate private code if match is private
      const private_code = values.is_private 
        ? Math.random().toString(36).substring(2, 8).toUpperCase()
        : null;

      // Create match
      const { data: match, error: matchError } = await supabase
        .from('matches')
        .insert({
          venue_id: values.venue_id,
          host_id: user.id,
          match_date: matchDate.toISOString(),
          max_players: values.max_players,
          cost_per_player: values.cost_per_player,
          is_private: values.is_private,
          private_code,
          status: 'upcoming'
        })
        .select()
        .single();

      if (matchError) throw matchError;

      // Add host as first participant
      const { error: participantError } = await supabase
        .from('match_participants')
        .insert({
          match_id: match.id,
          player_id: user.id
        });

      if (participantError) throw participantError;

      toast({
        title: "Success",
        description: "Match created successfully!",
      });

      // Redirect to match details page
      router.push(`/match/${match.id}`);

    } catch (error) {
      console.error("Error creating match:", error);
      toast({
        title: "Error",
        description: "Failed to create match",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <Card className="border-2">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <SoccerBall className="h-6 w-6 text-primary" />
            {t('create.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="venue_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('create.venue.label')}</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        const venue = venues.find(v => v.id === value);
                        setSelectedVenue(venue);
                      }} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('create.venue.placeholder')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {venues.map((venue) => (
                          <SelectItem key={venue.id} value={venue.id}>
                            {venue.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                    {selectedVenue?.phone_number && (
                      <FormDescription className="mt-2 flex items-center gap-2 text-primary">
                        <Phone className="h-4 w-4" />
                        {t('create.venue.bookingMessage').replace('{phone}', selectedVenue.phone_number)}
                      </FormDescription>
                    )}
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="match_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>{t('create.date.label')}</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>{t('create.date.placeholder')}</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="match_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('create.time.label')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('create.time.placeholder')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {timeOptions.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="max_players"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('create.players.label')}</FormLabel>
                      <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={field.value.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('create.players.label')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[10, 12, 14, 16].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} {t('create.players.suffix')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cost_per_player"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('create.cost.label')}</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          step="0.5"
                          placeholder={t('create.cost.placeholder')}
                          {...field}
                          onChange={e => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="is_private"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">{t('create.privateMatch.label')}</FormLabel>
                      <FormDescription>
                        {t('create.privateMatch.description')}
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="venue_confirmed"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm font-medium leading-none">
                        {t('create.venueConfirmation.label')}
                      </FormLabel>
                      <FormDescription className="text-sm text-muted-foreground">
                        {t('create.venueConfirmation.description')}
                      </FormDescription>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-white shadow-lg transition-all"
                disabled={isSubmitting || !form.watch('venue_confirmed')}
              >
                {isSubmitting ? t('create.submit.creating') : t('create.submit.create')}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}