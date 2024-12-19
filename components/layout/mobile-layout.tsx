"use client";

import { Home, PlusCircle, User, History, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useLanguage } from "@/lib/language-context";
import { HomeIcon, HistoryIcon, ProfileIcon, LogoutIcon } from "@/components/icons/nav-icons";

export function MobileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();

  const handleLogout = async () => {
    try {
      const supabase = createClientComponentClient();
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear any cached data
      router.refresh();
      // Force navigation to login
      window.location.href = '/auth/login';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="container max-w-screen-md mx-auto min-h-screen flex flex-col bg-background">
      <main className="flex-1 pb-16">{children}</main>
      
      <nav className="fixed bottom-0 left-0 right-0">
        <div className="container max-w-screen-md mx-auto bg-card border-t">
          <div className="flex items-center justify-around p-2">
            <Link
              href="/"
              className={cn(
                "flex flex-col items-center p-2 rounded-lg transition-colors",
                pathname === "/" ? "text-primary" : "text-muted-foreground"
              )}
            >
              <HomeIcon />
            </Link>
            
            <Link
              href="/history"
              className={cn(
                "flex flex-col items-center p-2 rounded-lg transition-colors",
                pathname === "/history" ? "text-primary" : "text-muted-foreground"
              )}
            >
              <HistoryIcon />
            </Link>
            
            <Link
              href="/create"
              className="flex flex-col items-center -mt-8 p-2"
            >
              <div className="bg-primary text-primary-foreground p-4 rounded-full shadow-lg hover:shadow-xl transition-shadow">
                <PlusCircle className="h-7 w-7" />
              </div>
            </Link>
            
            <Link
              href="/profile"
              className={cn(
                "flex flex-col items-center p-2 rounded-lg transition-colors",
                pathname === "/profile" ? "text-primary" : "text-muted-foreground"
              )}
            >
              <ProfileIcon />
            </Link>
            
            <button 
              onClick={handleLogout}
              className="flex flex-col items-center p-2 text-muted-foreground"
            >
              <LogoutIcon />
            </button>
          </div>
        </div>
      </nav>
      
      <div className="py-6 text-center text-sm text-muted-foreground bg-background">
        <p>{t('footer.joinCommunity')}</p>
      </div>
    </div>
  );
}