import { redirect } from "next/navigation";

export default function CourseDetailPage() {
  // Legacy compatibility: point this old route at the new per-course Next.js overview.
  // The canonical course details live under `/courses/:slug/overview`.
  redirect("/courses/diabetes-awareness-and-management/overview");
}
