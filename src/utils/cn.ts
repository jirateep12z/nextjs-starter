import { twMerge } from 'tailwind-merge';

import { type ClassValue, clsx } from 'clsx';

export function Cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
