import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMNT(amount: number): string {
  return new Intl.NumberFormat("mn-MN").format(amount) + "₮";
}

/**
 * URL-safe slug from a Mongolian-Cyrillic or Latin title.
 * Strips diacritics, lowercases, collapses non-alphanumeric runs to "-".
 */
const cyrillicMap: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo", ж: "j", з: "z",
  и: "i", й: "i", к: "k", л: "l", м: "m", н: "n", о: "o", ө: "o", п: "p",
  р: "r", с: "s", т: "t", у: "u", ү: "u", ф: "f", х: "h", ц: "ts", ч: "ch",
  ш: "sh", щ: "sh", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
};

export function slugify(input: string): string {
  const lower = input.trim().toLowerCase();
  let out = "";
  for (const ch of lower) {
    out += cyrillicMap[ch] ?? ch;
  }
  return out
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  // Format deterministically as YYYY.MM.DD in UTC so the output is identical on
  // the server and the client. Relying on Intl locale data (e.g. "mn-MN") causes
  // hydration mismatches because Node and the browser ship different ICU data.
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}
