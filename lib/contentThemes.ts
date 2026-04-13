/**
 * Rotating clay-style section banners for the medication course reader (illustration per chapter).
 * Placement rationale: see `lib/medcomImagery.ts` (catalog + in-flow learning).
 */
export const CHAPTER_CONTENT_BANNERS = [
  "/images/content/theme-safety.png",
  "/images/content/theme-communication.png",
  "/images/content/theme-records.png",
  "/images/content/theme-person-centred.png",
  "/images/content/theme-medicine.png",
] as const;

/** Dedicated clay art for Chapter 2. “What are your responsibilities?” (matches in-chapter hero). */
export const CHAPTER_2_RESPONSIBILITIES_BANNER =
  "/images/content/chapter-ch2-responsibilities-clay.png" as const;

export function contentBannerForChapter(stepIndex: number): string {
  if (stepIndex === 1) return CHAPTER_2_RESPONSIBILITIES_BANNER;
  return CHAPTER_CONTENT_BANNERS[stepIndex % CHAPTER_CONTENT_BANNERS.length];
}
