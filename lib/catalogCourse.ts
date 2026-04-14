import type { Course } from "./siteData";

/** Unified row for course grids (built-in catalog + community uploads). */
export type CatalogListItem = {
  id: string;
  title: string;
  category: string;
  audience: string[];
  collections: string[];
  chapters: number;
  duration: string;
  thumbnail: string;
  recommended: boolean;
  startPath: string;
};

export function staticCourseToCatalog(c: Course): CatalogListItem {
  return {
    id: `static-${c.id}`,
    title: c.title,
    category: c.category,
    audience: c.audience,
    collections: c.collections,
    chapters: c.chapters,
    duration: c.duration,
    thumbnail: c.thumbnail,
    recommended: c.recommended,
    startPath: c.startPath,
  };
}

export type CommunityCourseListDto = {
  id: string;
  slug: string;
  title: string;
  category: string;
  audience: string[];
  collections: string[];
  duration: string;
  thumbnail: string;
  featured: boolean;
  chapters: number;
};

export function communityCourseToCatalog(c: CommunityCourseListDto): CatalogListItem {
  return {
    id: `community-${c.id}`,
    title: c.title,
    category: c.category,
    audience: c.audience,
    collections: c.collections,
    chapters: c.chapters,
    duration: c.duration,
    thumbnail: c.thumbnail,
    recommended: c.featured,
    startPath: `/courses/community/${c.slug}/overview`,
  };
}
