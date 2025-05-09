import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export async function generateUniqueSlug(
  baseSlug: string,
  findUnique: (slug: string) => Promise<any>,
  maxAttempts = 5
): Promise<string> {
  let slug = slugify(baseSlug);
  let slugExists = true;
  let attempts = 0;

  while (slugExists && attempts < maxAttempts) {
    const existing = await findUnique(slug);

    if (!existing) {
      slugExists = false;
    } else {
      slug = `${slugify(baseSlug)}-${Math.random().toString(36).substring(2, 7)}`;
      attempts++;
    }
  }

  if (slugExists) {
    throw new Error("Could not generate unique slug");
  }

  return slug;
}
