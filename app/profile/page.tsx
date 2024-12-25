"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { RatingDisplay } from "@/components/ui/rating-display";
import imageCompression from 'browser-image-compression';
import { Star } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { subscribeToNotifications, unsubscribeFromNotifications, getNotificationStatus } from "@/lib/onesignal";

const formSchema = z.object({
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers and underscores"),
  phone_number: z.string().optional(),
  phone_public: z.boolean().default(false),
  notifications_enabled: z.boolean().default(false),
  speed: z.number().min(1).max(5),
  pace: z.number().min(1).max(5),
  power: z.number().min(1).max(5),
});

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [communityRating, setCommunityRating] = useState<number | null>(null);
  const [notificationStatus, setNotificationStatus] = useState<string>('default');
  const supabase = createClientComponentClient();
  const { toast } = useToast();
  const { t } = useLanguage();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      phone_number: "",
      phone_public: false,
      notifications_enabled: false,
      speed: 3,
      pace: 3,
      power: 3,
    },
  });

  // Calculate self rating
  const selfRating = (form.watch('speed') + form.watch('pace') + form.watch('power')) / 3;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        // Get notification status
        const status = await getNotificationStatus();
        setNotificationStatus(status);

        // Fetch all ratings for this user
        const { data: ratings } = await supabase
          .from('match_ratings')
          .select('rating')
          .eq('rated_player_id', user.id);

        if (profile) {
          setProfile(profile);
          form.reset({
            username: profile.username || "",
            phone_number: profile.phone_number || "",
            phone_public: profile.phone_public || false,
            notifications_enabled: status === 'granted',
            speed: profile.speed || 3,
            pace: profile.pace || 3,
            power: profile.power || 3,
          });

          // Calculate average rating if there are any ratings
          if (ratings && ratings.length > 0) {
            const avgRating = ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length;
            setCommunityRating(Number(avgRating.toFixed(1)));
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleAvatarUpload = async (file: File) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const allowedTypes = ['jpg', 'jpeg', 'png', 'gif'];
      
      if (!fileExt || !allowedTypes.includes(fileExt)) {
        throw new Error('Invalid file type. Please upload a JPG, PNG, or GIF image.');
      }

      // Compress image
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);
      
      const fileName = `${user.id}.${fileExt}`;
      
      // Delete existing avatar if any
      await supabase.storage
        .from('avatars')
        .remove([fileName]);

      // Upload compressed image
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, compressedFile, { 
          upsert: true,
          contentType: `image/${fileExt}`
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      setProfile({ ...profile, avatar_url: publicUrl });
      toast({
        title: "Success",
        description: "Profile picture updated",
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload profile picture",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Handle notification subscription
      let notificationSuccess = true;
      if (values.notifications_enabled) {
        notificationSuccess = await subscribeToNotifications();
        if (!notificationSuccess) {
          // If subscription failed, update the form state
          form.setValue('notifications_enabled', false);
          toast({
            title: "Notification Error",
            description: "Failed to enable notifications. Please check your browser settings.",
            variant: "destructive",
          });
          return;
        }
      } else {
        await unsubscribeFromNotifications();
      }

      // Check if username is already taken
      const { data: existingUsers, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', values.username)
        .neq('id', user.id);

      if (checkError) throw checkError;

      if (existingUsers && existingUsers.length > 0) {
        form.setError('username', {
          type: 'manual',
          message: 'Username is already taken'
        });
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          username: values.username,
          phone_number: values.phone_number,
          phone_public: values.phone_public,
          notifications_enabled: notificationSuccess && values.notifications_enabled,
          speed: values.speed,
          pace: values.pace,
          power: values.power,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('profile.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center">
            <div className="relative group cursor-pointer">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback>{profile?.full_name?.[0] || "?"}</AvatarFallback>
              </Avatar>
              
              {/* Overlay with hover effect */}
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                <label htmlFor="avatar-upload" className="text-xs text-white cursor-pointer">
                  {t('profile.changePhoto')}
                </label>
              </div>
              
              {/* Hidden file input */}
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleAvatarUpload(file);
                }}
              />
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium">{t('profile.fullName')}</p>
            <p className="text-sm text-muted-foreground">
              {profile?.full_name || t('profile.notSet')}
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('profile.username')}</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('profile.phoneNumber.label')}</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={t('profile.phoneNumber.placeholder')} 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone_public"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        {t('profile.sharePhone')}
                      </FormLabel>
                      <FormDescription>
                        {t('profile.sharePhoneDesc')}
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
                name="notifications_enabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Push Notifications
                      </FormLabel>
                      <FormDescription>
                        Receive notifications about new matches
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

              {/* Player Ratings */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>
                    {t('profile.ratings.speed.value').replace('{value}', form.watch('speed').toString())}
                  </Label>
                  <FormField
                    control={form.control}
                    name="speed"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Slider
                            min={1}
                            max={5}
                            step={1}
                            value={[field.value]}
                            onValueChange={([value]) => field.onChange(value)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    {t('profile.ratings.pace.value').replace('{value}', form.watch('pace').toString())}
                  </Label>
                  <FormField
                    control={form.control}
                    name="pace"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Slider
                            min={1}
                            max={5}
                            step={1}
                            value={[field.value]}
                            onValueChange={([value]) => field.onChange(value)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    {t('profile.ratings.power.value').replace('{value}', form.watch('power').toString())}
                  </Label>
                  <FormField
                    control={form.control}
                    name="power"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Slider
                            min={1}
                            max={5}
                            step={1}
                            value={[field.value]}
                            onValueChange={([value]) => field.onChange(value)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center">
                    <p className="font-medium">{t('profile.selfRating')}</p>
                    <p className="text-lg font-semibold">{selfRating.toFixed(1)}</p>
                  </div>
                  {communityRating ? (
                    <div className="flex justify-between items-center mt-2">
                      <p className="font-medium">{t('profile.communityRating')}</p>
                      <div className="text-right">
                        <RatingDisplay rating={communityRating} />
                        <p className="text-xs text-muted-foreground mt-1">
                          {t('profile.basedOnFeedback')}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center mt-2">
                      <p className="font-medium">{t('profile.communityRating')}</p>
                      <p className="text-sm text-muted-foreground">
                        {t('profile.noRatingsYet')}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <Button type="submit" className="w-full">
                {t('profile.updateProfile')}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}