import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CommunityCourseOverview } from "@/components/CommunityCourseOverview";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("community_courses")
    .select("title")
    .eq("slug", slug)
    .maybeSingle();
  if (!data?.title) return { title: "Course | Medcom" };
  return { title: `${data.title} | Overview | Medcom` };
}

export default async function CommunityOverviewPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: course } = await supabase
    .from("community_courses")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (!course) notFound();
  if (!course.published && course.created_by !== user?.id) notFound();

  const { data: chapterRows } = await supabase
    .from("community_course_chapters")
    .select("title, sort_order")
    .eq("course_id", course.id)
    .order("sort_order", { ascending: true });

  const chapterTitles = (chapterRows ?? []).map((c) => c.title);
  const learningOutcomes = Array.isArray(course.learning_outcomes)
    ? (course.learning_outcomes as string[])
    : [];

  return (
    <CommunityCourseOverview
      slug={slug}
      title={course.title}
      duration={course.duration}
      thumbnail={course.thumbnail}
      chapterTitles={chapterTitles}
      learningOutcomes={learningOutcomes.filter(Boolean)}
      canDelete={course.created_by === user?.id}
    />
  );
}
