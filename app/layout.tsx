import './globals.css';
import type { Metadata } from 'next';
import { Inter, Russo_One, Roboto, Lexend } from 'next/font/google';
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
const lexend = Lexend({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Yabalitsa - Βρες την παρέα σου για μπάλα',
  description: 'Η Yabalitsa είναι η απόλυτη πλατφόρμα για ποδοσφαιρόφιλους! Οργάνωσε τα παιχνίδια σου, βρες νέες παρέες για μπάλα, και συμμετέχε σε αγώνες στην περιοχή σου. Εύκολα, γρήγορα και διασκεδαστικά!',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
  },
  openGraph: {
    title: 'Yabalitsa - Βρες την παρέα σου για μπάλα',
    description: 'Η απόλυτη πλατφόρμα για ποδοσφαιρόφιλους! Οργάνωσε τα παιχνίδια σου, βρες νέες παρέες για μπάλα.',
    type: 'website',
    url: 'https://yabalitsa.com',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Yabalitsa - Organize Football Games',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yabalitsa - Βρες την παρέα σου για μπάλα',
    description: 'Η απόλυτη πλατφόρμα για ποδοσφαιρόφιλους! Οργάνωσε τα παιχνίδια σου, βρες νέες παρέες για μπάλα.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="el" suppressHydrationWarning className={russoOne.className}>
      <head />
      <body suppressHydrationWarning className={lexend.className}>
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