import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility para mesclar classes Tailwind sem conflitos.
 * Combina clsx (condicionais) com tailwind-merge (deduplicação de classes Tailwind).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
