/** URL-safe slug from a title (lowercase, hyphenated). */
export function slugifyTitle(input: string): string {
  const s = input
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return s.length > 0 ? s : "course";
}
