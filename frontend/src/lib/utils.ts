import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export const createId = (): string =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const compactFormatter = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });
const numberFormatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });

export const formatNumber = (value: unknown, compact = false): string => {
  if (typeof value !== 'number' || !Number.isFinite(value)) return String(value ?? '');
  return compact && Math.abs(value) >= 10_000 ? compactFormatter.format(value) : numberFormatter.format(value);
};
