import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getFirebaseImageUrl = (path: string | undefined) => {
  if (!path) return "/placeholder.jpg"; // Make sure you have a simple placeholder.jpg in your public folder!
  if (path.startsWith("http")) return path; 
  
  const bucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  const encodedPath = encodeURIComponent(path);
  return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodedPath}?alt=media`;
};