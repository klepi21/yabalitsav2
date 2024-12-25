"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { ProfileCard } from "@/components/profile/profile-card";
import { ProfileForm } from "@/components/profile/profile-form";
import { AuthCheck } from "@/components/auth-check";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  phone_number?: string;
  position?: string;
  self_rating?: number;
  created_at: string;
}

interface Stats {
  gamesPlayed: number;
  selfRating: number;
  communityRating: number;
}

interface FormData {
  full_name: string;
  phone_number?: string;
  position?: string;
  self_rating: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [stats, setStats] = useState<Stats>({
    gamesPlayed: 0,
    selfRating: 5,
    communityRating: 0,
  });
  
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserAndStats = async () => {
      try {
        // Get user profile
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) return;

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();

        // Get games played count
        const { count: gamesCount } = await supabase
          .from('match_participants')
          .select('*', { count: 'exact' })
          .eq('player_id', authUser.id);

        // Get community rating (you'll need to implement this based on your rating system)
        // This is just a placeholder
        const communityRating = 0;

        setUser(profile);
        setStats({
          gamesPlayed: gamesCount || 0,
          selfRating: profile?.self_rating || 5,
          communityRating: communityRating,
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndStats();
  }, []);

  const handleSave = async (formData: FormData) => {
    if (!user) return;

    try {
      const updatedProfile: Partial<Profile> = {
        full_name: formData.full_name,
        phone_number: formData.phone_number,
        position: formData.position,
        self_rating: parseFloat(formData.self_rating),
      };

      const { error } = await supabase
        .from('profiles')
        .update(updatedProfile)
        .eq('id', user.id);

      if (error) throw error;

      // Update local state
      setUser(prev => prev ? { ...prev, ...updatedProfile } : null);
      setStats(prev => ({
        ...prev,
        selfRating: parseFloat(formData.self_rating),
      }));
      
      setIsEditing(false);
      toast({
        title: "Επιτυχής ενημέρωση",
        description: "Το προφίλ σας ενημερώθηκε με επιτυχία",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Σφάλμα",
        description: "Υπήρξε πρόβλημα κατά την ενημέρωση του προφίλ",
        variant: "destructive",
      });
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <AuthCheck>
      <div className="container max-w-4xl py-6">
        {isEditing ? (
          <ProfileForm 
            user={user} 
            onSave={handleSave}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <ProfileCard 
            user={user}
            stats={stats}
            onEdit={() => setIsEditing(true)}
          />
        )}
      </div>
    </AuthCheck>
  );
}