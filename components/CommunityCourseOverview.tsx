"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SiteNav } from "@/components/SiteNav";

export function CommunityCourseOverview({
  slug,
  title,
  duration,
  thumbnail,
  chapterTitles,
  learningOutcomes,
  canDelete,
}: {
  slug: string;
  title: string;
  duration: string;
  thumbnail: string;
  chapterTitles: string[];
  learningOutcomes: string[];
  canDelete?: boolean;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function onDelete() {
    if (deleting) return;
    setDeleteError(null);
    const ok = window.confirm(
      `Delete “${title}”? This can’t be undone and will remove chapters and questions.`
    );
    if (!ok) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/community-courses/${slug}`, { method: "DELETE" });
      const j = (await res.json()) as { error?: string };
      if (!res.ok) {
        setDeleteError(j.error ?? "Could not delete course.");
        return;
      }
      router.push("/courses");
      router.refresh();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <SiteNav activeOverride="/courses" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="text-sm text-slate-500 mb-4" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-teal-600">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/courses" className="hover:text-teal-600">
            Courses
          </Link>
          <span className="mx-2">/</span>
          <span className="text-slate-700">{title}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] items-start">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">{title}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-6">
              <span>
                <i className="fas fa-clock mr-1 text-teal-600" aria-hidden />
                {duration}
              </span>
              <span>
                <i className="fas fa-book mr-1 text-teal-600" aria-hidden />
                {chapterTitles.length} chapters
              </span>
            </div>
            <p className="text-slate-700 mb-6">
              Use the chapter menu while learning to jump between sections. Each chapter supports optional
              multiple choice blocks at the bottom (same pattern as other Medcom modules).
            </p>
            {learningOutcomes.length > 0 ? (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-slate-900 mb-2">Learning outcomes</h2>
                <ul className="list-disc pl-6 space-y-2 text-slate-800 text-sm">
                  {learningOutcomes.map((o) => (
                    <li key={o}>{o}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            <div className="flex flex-wrap gap-3 items-center">
              <Link
                href={`/courses/community/${slug}/learn/1`}
                className="inline-flex items-center justify-center rounded-lg bg-teal-600 px-6 py-3 text-white font-semibold shadow-sm hover:bg-teal-700 transition-colors"
              >
                Start training
              </Link>
              {canDelete ? (
                <button
                  type="button"
                  onClick={onDelete}
                  disabled={deleting}
                  className="inline-flex items-center justify-center rounded-lg border border-rose-200 bg-rose-50 px-5 py-3 text-rose-800 font-semibold hover:bg-rose-100 disabled:opacity-50"
                >
                  <i className="fas fa-trash mr-2" aria-hidden />
                  {deleting ? "Deleting…" : "Delete course"}
                </button>
              ) : null}
            </div>
            {deleteError ? (
              <p className="mt-3 text-sm text-rose-800 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
                {deleteError}
              </p>
            ) : null}
          </div>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-sm">
            <Image
              src={thumbnail}
              alt=""
              fill
              className="object-cover"
              sizes="280px"
              unoptimized
            />
          </div>
        </div>

        <section className="mt-12 border-t border-slate-200 pt-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Chapters</h2>
          <ol className="space-y-2 list-decimal pl-6 text-slate-800">
            {chapterTitles.map((t, i) => (
              <li key={`${i}-${t}`}>
                <Link
                  href={`/courses/community/${slug}/learn/${i + 1}`}
                  className="text-teal-700 hover:text-teal-900 underline-offset-2 hover:underline"
                >
                  {t}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={`/courses/community/${slug}/learn/assessment`}
                className="text-teal-700 hover:text-teal-900 underline-offset-2 hover:underline"
              >
                Assessment
              </Link>
            </li>
          </ol>
        </section>
      </div>
    </>
  );
}
