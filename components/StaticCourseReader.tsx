"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ActiveLearningChrome } from "@/components/learning/ActiveLearningChrome";
import { MarkdownContent } from "@/components/MarkdownContent";
import type { Course } from "@/lib/siteData";

function parseStepParam(s: string, chapterCount: number): number {
  if (s === "assessment") return chapterCount;
  const n = parseInt(s, 10);
  if (!Number.isNaN(n) && n >= 1 && n <= chapterCount) return n - 1;
  return 0;
}

function progressPercent(idx: number, totalSteps: number) {
  return Math.round(((idx + 1) / totalSteps) * 100);
}

function makeChapters(count: number) {
  return Array.from({ length: count }).map((_, i) => ({
    idx: i,
    title: `Chapter ${i + 1}`,
  }));
}

function placeholderMarkdown(courseTitle: string, chapterTitle: string) {
  return `
## ${chapterTitle}

This interactive lesson isn’t migrated yet, but the **learning flow is wired up** so every course can be started from the catalog.

### What you can do now
- Use **Next / Previous** to move through chapters
- Open the **Assessment** step at the end
- Return to the course overview at any time

### Next steps for this course
We can migrate the legacy HTML for **${courseTitle}** into real chapter content (Markdown or HTML) and add quizzes.
`;
}

export function StaticCourseReader({ course, stepParam }: { course: Course; stepParam: string }) {
  const router = useRouter();
  const chapterCount = Math.max(6, Math.min(20, course.chapters || 10));
  const chapters = useMemo(() => makeChapters(chapterCount), [chapterCount]);
  const totalSteps = chapters.length + 1;
  const stepIndex = parseStepParam(stepParam, chapters.length);
  const isAssessment = stepIndex === chapters.length;
  const isLast = stepIndex >= totalSteps - 1;

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const goToStep = useCallback(
    (idx: number) => {
      if (idx < 0 || idx >= totalSteps) return;
      const path =
        idx < chapters.length
          ? `/courses/${course.slug}/learn/${idx + 1}`
          : `/courses/${course.slug}/learn/assessment`;
      router.push(path);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setSidebarOpen(false);
    },
    [chapters.length, course.slug, router, totalSteps]
  );

  const next = useCallback(() => {
    if (stepIndex < totalSteps - 1) goToStep(stepIndex + 1);
  }, [goToStep, stepIndex, totalSteps]);

  const prev = useCallback(() => {
    if (stepIndex > 0) goToStep(stepIndex - 1);
  }, [goToStep, stepIndex]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName || "";
      if (tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement).isContentEditable)
        return;
      if (e.key === "ArrowLeft" && stepIndex > 0) {
        e.preventDefault();
        prev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [next, prev, stepIndex]);

  const ch = !isAssessment ? chapters[stepIndex] : null;
  const title = isAssessment ? "Assessment" : `Chapter ${stepIndex + 1}: ${ch?.title ?? ""}`;
  const pct = progressPercent(stepIndex, totalSteps);
  const meta = isAssessment
    ? `Final step • ${totalSteps} of ${totalSteps}`
    : `Chapter ${stepIndex + 1} of ${chapters.length} • ${pct}% through module`;

  const md = isAssessment
    ? `## Assessment\n\nThis is a placeholder assessment for **${course.title}**.\n\n- We can port the legacy assessment content here.\n`
    : placeholderMarkdown(course.title, ch?.title ?? `Chapter ${stepIndex + 1}`);

  return (
    <>
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-4">
              <button
                type="button"
                className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
                aria-label="Open chapter menu"
                onClick={() => setSidebarOpen(true)}
              >
                <i className="fas fa-bars text-xl" aria-hidden />
              </button>
              <Link
                href="/"
                className="flex-shrink-0 flex items-center no-underline text-inherit hover:opacity-90 transition-opacity"
              >
                <i className="fas fa-tint text-teal-600 text-2xl mr-2" aria-hidden />
                <span className="text-xl font-bold">
                  <span className="logo-florence">Med</span>
                  <span className="logo-academy">com</span>
                </span>
              </Link>
              <span className="md:hidden text-sm font-medium text-slate-700 truncate max-w-[10rem]">
                {isAssessment ? "Assessment" : `Ch. ${stepIndex + 1}`}
              </span>
            </div>
            <div className="hidden md:flex md:items-center md:space-x-6">
              <Link
                href={`/courses/${course.slug}/overview`}
                className="text-sm text-teal-700 hover:text-teal-900 font-medium"
              >
                ← Course overview
              </Link>
              <Link
                href="/courses"
                className="text-slate-600 hover:text-teal-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Courses
              </Link>
              <Link
                href="/my-learning"
                className="text-teal-600 font-semibold px-3 py-2 rounded-md text-sm"
              >
                My Learning
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-0 bg-black bg-opacity-40 z-[90] md:hidden transition-opacity ${
          sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!sidebarOpen}
        onClick={() => setSidebarOpen(false)}
      />

      <div className="flex learning-main max-w-7xl mx-auto relative">
        <aside
          className={`fixed md:sticky md:top-16 top-0 left-0 z-[95] w-72 max-w-[85vw] h-[calc(100vh-4rem)] bg-white border-r border-slate-200 overflow-y-auto transform transition-transform duration-200 ease-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          <div className="p-4 border-b border-slate-100 flex justify-between items-center md:block">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Course menu</p>
              <p className="text-sm font-semibold text-slate-900 mt-1 line-clamp-3">
                {course.title}
              </p>
            </div>
            <button
              type="button"
              className="md:hidden p-2 text-slate-500"
              aria-label="Close menu"
              onClick={() => setSidebarOpen(false)}
            >
              <i className="fas fa-times" aria-hidden />
            </button>
          </div>

          <nav className="p-3" aria-label="Chapters">
            <p className="text-xs font-semibold text-slate-500 px-2 mb-2">Chapters</p>
            <div className="space-y-0.5">
              {chapters.map((chapter) => {
                const active = !isAssessment && chapter.idx === stepIndex;
                return (
                  <button
                    key={chapter.idx}
                    type="button"
                    className={`learning-chapter-btn w-full text-left px-3 py-2.5 rounded-lg text-sm border transition-colors ${
                      active
                        ? "bg-teal-50 border-teal-200 text-teal-900 font-semibold"
                        : "border-transparent text-slate-700 hover:bg-slate-50"
                    }`}
                    onClick={() => goToStep(chapter.idx)}
                  >
                    <span className="font-medium text-slate-500 w-6 inline-block">
                      {chapter.idx + 1}
                    </span>
                    <span className="align-middle">{chapter.title}</span>
                  </button>
                );
              })}

              <button
                type="button"
                className={`learning-chapter-btn w-full text-left px-3 py-2.5 rounded-lg text-sm border mt-2 transition-colors ${
                  isAssessment
                    ? "bg-teal-50 border-teal-200 text-teal-900 font-semibold"
                    : "border-transparent text-slate-700 hover:bg-slate-50"
                }`}
                onClick={() => goToStep(chapters.length)}
              >
                <span className="font-medium text-slate-500 w-6 inline-block">
                  <i className="fas fa-clipboard-check" aria-hidden />
                </span>{" "}
                Assessment
              </button>
            </div>
          </nav>
        </aside>

        <main className="flex-1 min-w-0 p-4 md:p-8 lg:pl-8 pb-28 md:pb-32">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
              <p className="text-sm text-slate-600 mt-1">{meta}</p>
            </div>
            <div className="w-full sm:w-56">
              <div className="flex justify-between text-xs text-slate-600 mb-1">
                <span>Progress</span>
                <span aria-live="polite">{pct}%</span>
              </div>
              <div
                className="h-2 bg-slate-200 rounded-full overflow-hidden"
                role="progressbar"
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Course progress"
              >
                <div
                  className="h-full bg-teal-600 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          </div>

          <ActiveLearningChrome
            stepKey={stepParam}
            stepIndex={stepIndex}
            totalContentSteps={chapters.length}
            isAssessment={isAssessment}
            chapterTitle={ch?.title}
            learningOutcomes={[
              "Work through each chapter and use the assessment at the end to check understanding.",
            ]}
            estimatedMinutes={3}
          >
            <div className="prose prose-slate max-w-none">
              <MarkdownContent markdown={md} />
            </div>
          </ActiveLearningChrome>
        </main>
      </div>

      <footer
        id="learningFooterNav"
        className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white safe-area-pb"
        role="navigation"
        aria-label="Chapter navigation"
      >
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-3 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 sm:gap-4">
          <button
            type="button"
            disabled={stepIndex === 0}
            onClick={prev}
            className="justify-self-start px-3 sm:px-5 py-2.5 rounded-lg border-2 border-slate-300 text-slate-700 font-medium hover:bg-slate-50 active:scale-[0.98] transition-transform disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
          >
            <i className="fas fa-chevron-left mr-1 sm:mr-2" aria-hidden />
            <span className="hidden sm:inline">Previous</span>
            <span className="sm:hidden">Prev</span>
          </button>
          <p className="text-center text-xs sm:text-sm text-slate-500 min-w-0 truncate px-1">
            {isAssessment ? `Assessment • ${totalSteps} / ${totalSteps}` : `Step ${stepIndex + 1} of ${totalSteps}`}
          </p>
          <button
            type="button"
            onClick={next}
            className="justify-self-end px-3 sm:px-5 py-2.5 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700 active:scale-[0.98] transition-transform shadow-sm whitespace-nowrap min-w-[5.5rem] sm:min-w-0"
          >
            <span>{isLast ? "Finish" : "Next"}</span>
            <i className={`ml-1 sm:ml-2 ${isLast ? "fas fa-check" : "fas fa-chevron-right"}`} aria-hidden />
          </button>
        </div>
      </footer>
    </>
  );
}

