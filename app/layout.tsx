import './globals.css';
import type { Metadata } from 'next';
import { Inter, Russo_One, Roboto } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { MobileLayout } from '@/components/layout/mobile-layout';
import { Header } from "@/components/header";
import { LanguageProvider } from '@/lib/language-context';
import { FootballPattern } from '@/components/ui/football-pattern';

const inter = Inter({ subsets: ['latin'] });
const russoOne = Russo_One({ 
  weight: '400',
  subsets: ['latin'],
});
const roboto = Roboto({ 
  weight: ['400', '700', '900'],
  subsets: ['greek'],
});

export const metadata: Metadata = {
  title: 'FootballHub - Find & Join Football Matches',
  description: 'Connect with players, join matches, and organize games in your area',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="el" suppressHydrationWarning className={russoOne.className}>
      <body suppressHydrationWarning>
        <LanguageProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <FootballPattern />
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <div className="flex-1">
                <MobileLayout>
                  <main>{children}</main>
                </MobileLayout>
              </div>
            </div>
          </ThemeProvider>
        </LanguageProvider>
        <Toaster />
      </body>
    </html>
  );
}