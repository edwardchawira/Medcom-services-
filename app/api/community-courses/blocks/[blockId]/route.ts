import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { contentBlockPayloadSchema } from "@/lib/courseBuilder/types";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ blockId: string }> }
) {
  const { blockId } = await params;
  const supabase = await createSupabaseServerClient();

  let body: { payload?: unknown; status?: "draft" | "published" | "archived" };
  try {
    body = (await req.json()) as { payload?: unknown; status?: "draft" | "published" | "archived" };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const patch: Record<string, unknown> = {};
  if (body.payload) {
    const parsed = contentBlockPayloadSchema.safeParse(body.payload);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    patch.content_json = parsed.data;
  }
  if (body.status) {
    patch.status = body.status;
  }
  patch.updated_at = new Date().toISOString();

  const { error } = await supabase.from("community_course_lesson_blocks").update(patch).eq("id", blockId);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ blockId: string }> }
) {
  const { blockId } = await params;
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("community_course_lesson_blocks").delete().eq("id", blockId);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

