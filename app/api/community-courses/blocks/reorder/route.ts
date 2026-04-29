import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ReorderItem = { id: string; sortOrder: number };

export async function POST(req: Request) {
  let body: { items?: ReorderItem[] };
  try {
    body = (await req.json()) as { items?: ReorderItem[] };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const items = Array.isArray(body.items) ? body.items : [];
  if (items.length === 0) {
    return NextResponse.json({ error: "No reorder items supplied." }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  for (const item of items) {
    const { error } = await supabase
      .from("community_course_lesson_blocks")
      .update({ sort_order: item.sortOrder, updated_at: new Date().toISOString() })
      .eq("id", item.id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}

