'use client';

import { useEffect } from 'react';
import { initializeOneSignal, setExternalUserId } from '@/lib/onesignal';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export function OneSignalProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClientComponentClient();

  useEffect(() => {
    // Use setTimeout to delay OneSignal initialization
    const timer = setTimeout(() => {
      const initOneSignal = async () => {
        try {
          // Initialize OneSignal
          await initializeOneSignal();
          console.log('OneSignal initialization completed');
          
          // Set user ID for targeting if logged in
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await setExternalUserId(user.id);
          }
        } catch (error) {
          console.error('Error in OneSignal provider:', error);
        }
      };

      initOneSignal();
    }, 2000); // Delay by 2 seconds

    return () => clearTimeout(timer);
  }, []);

  return <>{children}</>;
} 