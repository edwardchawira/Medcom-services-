import Link from "next/link";
import { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";

export const metadata: Metadata = {
  title: "Course details | Medcom",
};

export default function CourseDetailPage() {
  return (
    <>
      <SiteNav activeOverride="/courses" />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Course details</h1>
        <p className="text-gray-600 mb-6">
          This placeholder route replaces the legacy <code>course-detail.html</code> for courses
          that do not yet have a dedicated interactive module in the Next.js app.
        </p>
        <Link
          href="/courses"
          className="inline-flex items-center text-teal-700 font-semibold hover:text-teal-900"
        >
          ← Back to courses
        </Link>
      </main>
    </>
  );
}
