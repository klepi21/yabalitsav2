"use client";

import Link from "next/link";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-context";

export function Header() {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-screen-md">
        <div className="container flex h-14 items-center justify-between px-4">
          <div className="flex-1" />
          <Link 
            href="/" 
            className="font-black text-2xl text-primary hover:text-primary/90 transition-colors tracking-wider"
            style={{ 
              fontFamily: "'Russo One', sans-serif",
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            {t("YABALITSA")}
          </Link>
          <div className="flex-1 flex justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
} 