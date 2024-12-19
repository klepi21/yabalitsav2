import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatName(fullName: string | null | undefined) {
  if (!fullName) return '';
  const [firstName, ...lastNames] = fullName.split(' ');
  if (lastNames.length === 0) return firstName;
  return `${firstName} ${lastNames.map(n => n[0]).join('. ')}.`;
}

export function getTeamSizes(maxPlayers: number) {
  const teamSize = maxPlayers / 2;
  return `${teamSize} x ${teamSize}`;
}
