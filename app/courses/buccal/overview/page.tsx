import type { Metadata } from "next";
import { courses } from "@/lib/siteData";
import { StaticCourseOverview } from "@/components/StaticCourseOverview";

export const metadata: Metadata = {
  title: "Buccal route | Overview | Medcom",
};

export default function BuccalOverviewPage() {
  const course = courses.find((c) => c.slug === "buccal");
  if (!course) return null;
  return <StaticCourseOverview course={course} startPath={course.startPath} />;
}

