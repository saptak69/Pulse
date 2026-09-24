import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import * as Icons from "lucide-react"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getIcon(name: string) {
  // @ts-ignore - dynamic icon mapping
  const Icon = Icons[name] || Icons.HelpCircle;
  return Icon;
}
