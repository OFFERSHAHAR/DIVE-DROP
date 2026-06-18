import clsx from 'clsx';

/**
 * Combines class names using clsx
 * Useful as an alias for clsx in styling utilities
 */
export function cn(...classes: Parameters<typeof clsx>) {
  return clsx(...classes);
}
