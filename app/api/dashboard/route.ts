import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const fullName =
    (user.user_metadata?.full_name as string | undefined) ||
    (user.user_metadata?.name as string | undefined) ||
    user.email ||
    "there";

  const { data: rows, error } = await supabase
    .from("user_course_progress")
    .select("course_key, course_title, status, progress, resume_path, updated_at, completed_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(20);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const completed = (rows ?? []).filter((r) => r.status === "completed");
  const certificatesCount = completed.length;

  const inProgress = (rows ?? []).filter((r) => r.status === "in_progress");
  const continueCourse = inProgress[0] ?? null;

  const recentActivity = (rows ?? []).slice(0, 5).map((r) => {
    const kind = r.status === "completed" ? "completed" : "started";
    return {
      kind,
      title: r.course_title,
      updatedAt: r.updated_at,
      badge: r.status === "completed" ? "+ Certificate" : "In Progress",
    };
  });

  return NextResponse.json({
    user: { fullName },
    certificatesCount,
    continueCourse: continueCourse
      ? {
          title: continueCourse.course_title,
          progress: continueCourse.progress,
          resumePath: continueCourse.resume_path || "/my-learning",
        }
      : null,
    recentActivity,
  });
}

