import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { courses } from "@/lib/siteData";
import { StaticCourseReader } from "@/components/StaticCourseReader";

function validStep(step: string, chapterCount: number) {
  if (step === "assessment") return true;
  const n = parseInt(step, 10);
  return !Number.isNaN(n) && n >= 1 && n <= chapterCount;
}

export function generateMetadata({
  params,
}: {
  params: { slug: string; step: string };
}): Metadata {
  const course = courses.find((c) => c.slug === params.slug);
  if (!course) return { title: "Course | Medcom" };
  return { title: `${course.title} | Learn | Medcom` };
}

export default function StaticLearnStepPage({
  params,
}: {
  params: { slug: string; step: string };
}) {
  const course = courses.find((c) => c.slug === params.slug);
  if (!course) return notFound();

  // Keep dynamic placeholder readers reasonable.
  const chapterCount = Math.max(6, Math.min(20, course.chapters || 10));
  if (!validStep(params.step, chapterCount)) {
    redirect(`/courses/${params.slug}/learn/1`);
  }

  return <StaticCourseReader course={course} stepParam={params.step} />;
}

