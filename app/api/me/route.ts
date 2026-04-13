import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  const fullName =
    (user.user_metadata?.full_name as string | undefined) ||
    (user.user_metadata?.name as string | undefined) ||
    user.email ||
    "there";

  return NextResponse.json(
    {
      user: {
        id: user.id,
        email: user.email,
        fullName,
      },
    },
    {
      status: 200,
      headers: { "Cache-Control": "private, no-store" },
    }
  );
}

