import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRole) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, serviceRole);

async function run() {
  const { data: chapters, error: chapterError } = await supabase
    .from("community_course_chapters")
    .select("id, content_md");

  if (chapterError) {
    throw chapterError;
  }

  for (const chapter of chapters ?? []) {
    const { data: existing } = await supabase
      .from("community_course_lesson_blocks")
      .select("id")
      .eq("chapter_id", chapter.id)
      .limit(1);

    if (existing && existing.length > 0) {
      continue;
    }

    await supabase.from("community_course_lesson_blocks").insert({
      chapter_id: chapter.id,
      sort_order: 1,
      block_type: "text",
      content_json: {
        kind: "text",
        title: "Migrated chapter content",
        markdown: chapter.content_md ?? "",
      },
      source: "manual",
      status: "published",
    });
  }

  console.log("Backfill complete.");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});

