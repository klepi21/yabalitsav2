"use client";
import { Dumbbell, Timer, Trophy, Goal } from "lucide-react";
import { useMemo } from 'react';

export function FootballPattern() {
  // Use useMemo to ensure consistent rendering between server and client
  const icons = useMemo(() => {
    const iconComponents = [
      <Goal key="goal" className="w-6 h-6" />,
      <Timer key="timer" className="w-6 h-6" />,
      <Trophy key="trophy" className="w-6 h-6" />,
      <Dumbbell key="dumbbell" className="w-6 h-6" />
    ];

    // Generate a fixed pattern instead of random
    return Array.from({ length: 200 }).map((_, i) => ({
      key: i,
      icon: iconComponents[i % iconComponents.length]
    }));
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden opacity-[0.15] dark:opacity-[0.2] pointer-events-none">
      <div className="absolute w-full h-full">
        <div className="grid grid-cols-8 gap-16 p-4 animate-[fade-in_1s_ease-in-out]">
          {icons.map(({ key, icon }) => (
            <div key={key} className="flex items-center justify-center">
              {icon}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 