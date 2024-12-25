'use client';

import { useEffect } from 'react';
import { initializeOneSignal, setExternalUserId } from '@/lib/onesignal';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export function OneSignalProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClientComponentClient();

  useEffect(() => {
    const initOneSignal = async () => {
      await initializeOneSignal();
      
      // Set user ID for targeting if logged in
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await setExternalUserId(user.id);
      }
    };

    initOneSignal();
  }, []);

  return <>{children}</>;
} 