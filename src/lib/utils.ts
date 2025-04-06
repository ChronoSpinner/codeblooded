import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Re-export all firestore functions for easier imports
export * from './firestore';

// Legacy function - keeping for backward compatibility
export async function fetchProducts() {
  const productsCollection = collection(db, "products");
  const productsSnapshot = await getDocs(productsCollection);
  return productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
