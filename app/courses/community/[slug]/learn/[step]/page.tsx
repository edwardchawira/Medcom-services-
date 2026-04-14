import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import {
  CommunityCourseReader,
  type CommunityChapter,
} from "@/components/CommunityCourseReader";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ChapterQuizQuestion } from "@/components/learning/ChapterQuiz";
import type { FlorenceAssessmentQuestion } from "@/components/learning/FlorenceAssessment";

type Props = { params: Promise<{ slug: string; step: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("community_courses")
    .select("title")
    .eq("slug", slug)
    .maybeSingle();
  if (!data?.title) return { title: "Course | Medcom" };
  return { title: `${data.title} | Learn | Medcom` };
}

function validStep(step: string, chapterCount: number): boolean {
  if (step === "assessment") return true;
  const n = parseInt(step, 10);
  return !Number.isNaN(n) && n >= 1 && n <= chapterCount;
}

export default async function CommunityLearnStepPage({ params }: Props) {
  const { slug, step } = await params;
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
    .select("id, sort_order, title, content_md")
    .eq("course_id", course.id)
    .order("sort_order", { ascending: true });

  const chapters: CommunityChapter[] = (chapterRows ?? []).map((c) => ({
    id: c.id,
    sort_order: c.sort_order,
    title: c.title,
    content_md: c.content_md,
  }));

  if (chapters.length === 0) {
    redirect(`/courses/community/${slug}/overview`);
  }

  if (!validStep(step, chapters.length)) {
    redirect(`/courses/community/${slug}/learn/1`);
  }

  const chapterIdForStep =
    step === "assessment" ? null : chapters.find((c) => c.sort_order === Number(step))?.id ?? null;

  const { data: qRows } = chapterIdForStep
    ? await supabase
        .from("community_chapter_questions")
        .select("id, sort_order, prompt, options, correct_index, explanation")
        .eq("chapter_id", chapterIdForStep)
        .order("sort_order", { ascending: true })
    : { data: [] as any[] };

  const quizQuestions: ChapterQuizQuestion[] = (qRows ?? []).map((q) => ({
    id: q.id,
    sort_order: q.sort_order,
    prompt: q.prompt,
    options: q.options ?? [],
    correct_index: q.correct_index,
    explanation: q.explanation ?? "",
  }));

  const { data: assessRows } =
    step === "assessment"
      ? await supabase
          .from("community_chapter_questions")
          .select(
            "id, sort_order, prompt, options, correct_index, community_course_chapters!inner(sort_order)"
          )
          .eq("community_course_chapters.course_id", course.id)
          .order("community_course_chapters.sort_order", { ascending: true })
          .order("sort_order", { ascending: true })
      : { data: [] as any[] };

  const learningOutcomes = Array.isArray(course.learning_outcomes)
    ? (course.learning_outcomes as string[])
    : [];

  const assessmentQuestions: FlorenceAssessmentQuestion[] = (assessRows ?? []).map((q) => {
    const chOrder = q.community_course_chapters?.sort_order ?? 1;
    const loIdx = clampNumber(chOrder, 1, Math.max(1, learningOutcomes.length));
    return {
      id: q.id,
      loTag: `LO${loIdx}`,
      prompt: q.prompt,
      options: q.options ?? [],
      correctIndex: q.correct_index,
    };
  });

  function clampNumber(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
  }

  return (
    <CommunityCourseReader
      slug={slug}
      courseTitle={course.title}
      learningOutcomes={learningOutcomes.filter(Boolean)}
      chapters={chapters}
      assessmentHtml={course.assessment_html ?? ""}
      stepParam={step}
      quizQuestions={quizQuestions}
      assessmentQuestions={assessmentQuestions}
    />
  );
}
