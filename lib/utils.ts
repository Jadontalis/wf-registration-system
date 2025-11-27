import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getInitials = (name: string): string => {
  const parts = name.trim().split(' ').filter(Boolean);
  
  if (parts.length === 0) return '';
  
  if (parts.length === 1) {
    return parts[0].substring(0, 1).toUpperCase();
  }
  
  return parts
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
