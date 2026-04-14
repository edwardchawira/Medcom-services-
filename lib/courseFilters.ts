import type { CatalogListItem } from "./catalogCourse";
import { matchesDurationBucket } from "./siteData";

export type CourseFilters = {
  category: string;
  audience: string;
  duration: string;
  collection: string;
  searchTerm: string;
};

export function filterCourses(
  allCourses: CatalogListItem[],
  filters: CourseFilters
): CatalogListItem[] {
  return allCourses.filter((course) => {
    if (filters.category && course.category !== filters.category) return false;
    if (filters.audience && !course.audience.includes(filters.audience))
      return false;
    if (
      filters.collection &&
      !course.collections.includes(filters.collection)
    )
      return false;
    if (
      filters.duration &&
      !matchesDurationBucket(course.duration, filters.duration)
    )
      return false;
    if (
      filters.searchTerm &&
      !course.title.toLowerCase().includes(filters.searchTerm)
    )
      return false;
    return true;
  });
}
