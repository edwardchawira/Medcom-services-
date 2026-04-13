import Link from "next/link";
import { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";

export const metadata: Metadata = {
  title: "Buccal route | Medcom",
};

export default function BuccalCoursePage() {
  return (
    <>
      <SiteNav activeOverride="/courses" />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          An introduction to the buccal route of medication
        </h1>
        <p className="text-gray-600 mb-6">
          Full chapter content from the legacy <code>course-detail-buccal.html</code> can be
          migrated here. Use the courses catalog to start other modules.
        </p>
        <Link href="/courses" className="text-teal-700 font-semibold hover:text-teal-900">
          ← Back to courses
        </Link>
      </main>
    </>
  );
}
