/**
 * Medcom claymorphism imagery: where assets are used (Next app).
 *
 * - **Course catalog** (`/courses`): `courses[].thumbnail` in `siteData.ts` drives
 *   `CoursesExplorer` cards: primary recognition + trust; one cover per course topic.
 * - **Collections** (`/collections`): `collections[].thumbnail` for thematic bundle identity.
 * - **In-flow learning** (medication module): `CHAPTER_CONTENT_BANNERS` in `contentThemes.ts`
 *   rotates wide banners above chapter HTML via `ActiveLearningChrome` to reinforce themes
 *   (safety, communication, records, person-centred, medicines) without duplicating the course hero.
 *   Chapter 2 (`contentBannerForChapter(1)`) uses `chapter-ch2-responsibilities-clay.png` only.
 *
 * - **Home** (`app/page.tsx`): hero uses `theme-person-centred.png` as welcoming clay art beside CTAs.
 */

export const MEDCOM_IMAGERY_VERSION = "2026-04-clay-canva" as const;
