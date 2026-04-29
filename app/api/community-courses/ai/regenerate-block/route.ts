import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { orchestrateBlockGeneration } from "@/lib/ai/generationOrchestrator";
import { regenerateBlockRequestSchema } from "@/lib/courseBuilder/types";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = regenerateBlockRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const payload = await orchestrateBlockGeneration({
    blockType: parsed.data.blockType,
    chapterTitle: parsed.data.chapterTitle,
    courseTitle: parsed.data.courseTitle,
    prompt: parsed.data.prompt,
    contextMarkdown: parsed.data.contextMarkdown,
  });

  const supabase = await createSupabaseServerClient();
  const { data: existingVersion } = await supabase
    .from("community_course_block_versions")
    .select("version_no")
    .eq("block_id", parsed.data.blockId)
    .order("version_no", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextVersion = (existingVersion?.version_no ?? 0) + 1;

  await supabase.from("community_course_lesson_blocks").update({ content_json: payload }).eq("id", parsed.data.blockId);
  await supabase.from("community_course_block_versions").insert({
    block_id: parsed.data.blockId,
    version_no: nextVersion,
    content_json: payload,
    prompt: parsed.data.prompt,
    model: "gpt-4o-mini",
  });

  return NextResponse.json({ block: payload, version: nextVersion }, { status: 200 });
}

