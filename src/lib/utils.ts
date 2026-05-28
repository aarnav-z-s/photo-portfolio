import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAspectRatio(width: number, height: number): string {
  return `${width} / ${height}`;
}

export function getPlaceholderStyle(color: string, width: number, height: number) {
  return {
    backgroundColor: color,
    aspectRatio: `${width} / ${height}`,
  };
}

// Generate a CSS gradient for placeholder from a base color
export function placeholderGradient(baseColor: string): string {
  return `linear-gradient(135deg, ${baseColor} 0%, #070707 100%)`;
}

// Stagger delay for animation children
export function staggerDelay(index: number, base = 0.05): number {
  return index * base;
}

// Clamp a value between min and max
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// Map a value from one range to another
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
}

// Format camera metadata for display
export function formatShutter(shutter: string): string {
  if (shutter.includes('/')) return shutter + 's';
  return shutter + 's';
}

export function formatISO(iso: string): string {
  return `ISO ${iso}`;
}

// Slugify a string
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Check if running in browser
export const isBrowser = typeof window !== 'undefined';

// Debounce
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  ms: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return function (...args: Parameters<T>) {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}
