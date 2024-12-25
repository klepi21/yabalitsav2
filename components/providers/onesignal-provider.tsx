'use client';

import { useEffect } from 'react';
import { initializeOneSignal, setExternalUserId } from '@/lib/onesignal';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export function OneSignalProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClientComponentClient();

  useEffect(() => {
    const initOneSignal = async () => {
      try {
        // Initialize OneSignal
        await initializeOneSignal();
        console.log('OneSignal initialization completed');
        
        // Set user ID for targeting if logged in
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await setExternalUserId(user.id);
          
          // Get user's notification preference from database
          const { data: profile } = await supabase
            .from('profiles')
            .select('notifications_enabled')
            .eq('id', user.id)
            .single();
            
          console.log('User profile notification preference:', profile?.notifications_enabled);
        }
      } catch (error) {
        console.error('Error in OneSignal provider:', error);
      }
    };

    initOneSignal();
  }, []);

  return <>{children}</>;
} 