import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// convetr prisma objects to plain objects

export function prismaToPlain<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}
