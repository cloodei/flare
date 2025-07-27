import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function checkCookie(name: string) {
  return document.cookie.split(";").find(row => row.startsWith(`${name}=`)) !== undefined;
}
