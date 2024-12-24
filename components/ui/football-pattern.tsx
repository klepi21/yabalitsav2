"use client";
import { Dumbbell, Timer, Trophy, Goal } from "lucide-react";
import { useMemo } from 'react';

export function FootballPattern() {
  return (
    <div className="fixed inset-0 -z-50 h-full w-full opacity-[0.02] dark:opacity-[0.02]">
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="football-pattern"
            x="0"
            y="0"
            width="32"
            height="32"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M16 0a16 16 0 110 32 16 16 0 010-32zm0 2a14 14 0 100 28 14 14 0 000-28zm0 2a12 12 0 110 24 12 12 0 010-24zm0 2a10 10 0 100 20 10 10 0 000-20zm0 2a8 8 0 110 16 8 8 0 010-16zm0 2a6 6 0 100 12 6 6 0 000-12zm0 2a4 4 0 110 8 4 4 0 010-8zm0 2a2 2 0 100 4 2 2 0 000-4z"
              fill="currentColor"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#football-pattern)" />
      </svg>
    </div>
  );
} 