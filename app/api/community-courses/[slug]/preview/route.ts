import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();

  const { data: course, error: courseError } = await supabase
    .from("community_courses")
    .select("id, slug, title, learning_outcomes, assessment_html")
    .eq("slug", slug)
    .maybeSingle();

  if (courseError) {
    return NextResponse.json({ error: courseError.message }, { status: 500 });
  }
  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  const { data: chapters, error: chapterError } = await supabase
    .from("community_course_chapters")
    .select("id, title, sort_order, content_md")
    .eq("course_id", course.id)
    .order("sort_order", { ascending: true });

  if (chapterError) {
    return NextResponse.json({ error: chapterError.message }, { status: 500 });
  }

  const chapterIds = (chapters ?? []).map((chapter) => chapter.id);
  let blocks: unknown[] = [];

  if (chapterIds.length > 0) {
    const { data: fetchedBlocks } = await supabase
      .from("community_course_lesson_blocks")
      .select("id, chapter_id, sort_order, block_type, content_json, source, status")
      .in("chapter_id", chapterIds)
      .order("sort_order", { ascending: true });
    blocks = fetchedBlocks ?? [];
  }

  return NextResponse.json({
    course,
    chapters: chapters ?? [],
    blocks,
  });
}

