"use client";

import { Button } from "@/components/ui/button";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export function AuthOverlay() {
  const supabase = createClientComponentClient();

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm bg-background/80 flex items-center justify-center">
      <div className="max-w-sm mx-auto p-6 text-center space-y-4">
        <h2 className="text-2xl font-bold">Καλώς ήρθατε στο Yabalitsa</h2>
        <p className="text-muted-foreground">
          Συνδεθείτε για να δείτε όλες τις λεπτομέρειες και να συμμετάσχετε σε αγώνες
        </p>
        <Button onClick={handleLogin} size="lg" className="w-full">
          Σύνδεση με Google
        </Button>
      </div>
    </div>
  );
} 