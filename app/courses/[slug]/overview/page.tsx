import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { courses } from "@/lib/siteData";
import { StaticCourseOverview } from "@/components/StaticCourseOverview";

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const course = courses.find((c) => c.slug === params.slug);
  return {
    title: course ? `${course.title} | Overview | Medcom` : "Course overview | Medcom",
  };
}

export default function StaticCourseOverviewPage({ params }: { params: { slug: string } }) {
  const course = courses.find((c) => c.slug === params.slug);
  if (!course) return notFound();
  return <StaticCourseOverview course={course} startPath={course.startPath} />;
}

