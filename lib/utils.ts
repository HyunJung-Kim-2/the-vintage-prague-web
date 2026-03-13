import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency: "EUR" | "CZK" = "EUR"): string {
  return new Intl.NumberFormat("en-EU", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function conditionLabel(condition: string): string {
  const map: Record<string, string> = {
    new: "New",
    s: "S Grade",
    a: "A Grade",
    b: "B Grade",
  };
  return map[condition] ?? condition;
}

export function categoryLabel(category: string): string {
  const map: Record<string, string> = {
    bags: "Bags",
    clothing: "Clothing",
    shoes: "Shoes",
    wallets: "Wallets",
  };
  return map[category] ?? category;
}
