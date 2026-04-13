"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { medicationCourse } from "@/lib/medicationCourseData";
import { bindChapterMcqs } from "@/lib/bindChapterMcqs";
import { ActiveLearningChrome } from "@/components/learning/ActiveLearningChrome";
import { contentBannerForChapter } from "@/lib/contentThemes";
import { CheckpointModal } from "@/components/learning/CheckpointModal";
import {
  getCheckpointWhenLeavingStep,
  isCheckpointPassed,
  markCheckpointPassedId,
  type MedicationCheckpoint,
} from "@/lib/medicationCheckpoints";

const STORAGE_KEY = "medcom_medication_course_v1";

function loadProgress(): Set<number> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as unknown;
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

function saveProgress(set: Set<number>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
}

function parseStepParam(
  s: string,
  chapterCount: number
): number {
  if (s === "assessment") return chapterCount;
  const n = parseInt(s, 10);
  if (!Number.isNaN(n) && n >= 1 && n <= chapterCount) return n - 1;
  return 0;
}

function progressPercent(idx: number, totalSteps: number) {
  return Math.round(((idx + 1) / totalSteps) * 100);
}

export function MedicationCourseReader({ stepParam }: { stepParam: string }) {
  const router = useRouter();
  const course = medicationCourse;
  const chapters = course.chapters;
  const totalSteps = chapters.length + 1;
  const stepIndex = parseStepParam(stepParam, chapters.length);
  const bodyRef = useRef<HTMLDivElement>(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [completed, setCompleted] = useState<Set<number>>(loadProgress);
  const [checkpointOpen, setCheckpointOpen] = useState<MedicationCheckpoint | null>(null);

  const isAssessment = stepIndex === chapters.length;
  const isLast = stepIndex >= totalSteps - 1;

  const goToStep = useCallback(
    (idx: number) => {
      if (idx < 0 || idx >= totalSteps) return;
      const path =
        idx < chapters.length
          ? `/courses/medication-home-care/learn/${idx + 1}`
          : `/courses/medication-home-care/learn/assessment`;
      router.push(path);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setSidebarOpen(false);
    },
    [chapters.length, router, totalSteps]
  );

  const advanceToNextStep = useCallback(() => {
    if (stepIndex < totalSteps - 1) {
      setCompleted((prev) => {
        const nextSet = new Set(prev);
        nextSet.add(stepIndex);
        saveProgress(nextSet);
        return nextSet;
      });
      goToStep(stepIndex + 1);
    } else {
      setCompleted((prev) => {
        const nextSet = new Set(prev);
        nextSet.add(stepIndex);
        saveProgress(nextSet);
        return nextSet;
      });
      alert("Module complete (demo). Progress saved in your browser.");
    }
  }, [goToStep, stepIndex, totalSteps]);

  const next = useCallback(() => {
    if (stepIndex < totalSteps - 1) {
      const cp = getCheckpointWhenLeavingStep(stepIndex);
      if (cp && !isCheckpointPassed(cp.id)) {
        setCheckpointOpen(cp);
        return;
      }
    }
    advanceToNextStep();
  }, [advanceToNextStep, stepIndex, totalSteps]);

  const handleCheckpointPassed = useCallback(() => {
    setCheckpointOpen((prev) => {
      if (prev) markCheckpointPassedId(prev.id);
      return null;
    });
    advanceToNextStep();
  }, [advanceToNextStep]);

  const prev = useCallback(() => {
    if (stepIndex > 0) goToStep(stepIndex - 1);
  }, [goToStep, stepIndex]);

  useEffect(() => {
    const root = bodyRef.current;
    if (!root) return;
    bindChapterMcqs(root);
  }, [stepIndex, isAssessment]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (checkpointOpen) return;
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
  }, [checkpointOpen, next, prev, stepIndex]);

  const ch = !isAssessment ? chapters[stepIndex] : null;
  const title = isAssessment
    ? "Assessment"
    : `Chapter ${stepIndex + 1}: ${ch?.title ?? ""}`;
  const meta = isAssessment
    ? `Final step • ${totalSteps} of ${totalSteps}`
    : `Chapter ${stepIndex + 1} of ${chapters.length} • ${progressPercent(stepIndex, totalSteps)}% through module`;
  const bodyHtml = isAssessment
    ? course.assessmentHtml
    : ch?.html ?? "";
  const pct = progressPercent(stepIndex, totalSteps);

  return (
    <>
      {checkpointOpen ? (
        <CheckpointModal
          checkpoint={checkpointOpen}
          onPassed={handleCheckpointPassed}
          onStay={() => setCheckpointOpen(null)}
        />
      ) : null}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-4">
              <button
                type="button"
                className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
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
              <span className="md:hidden text-sm font-medium text-gray-700 truncate max-w-[9rem]">
                {isAssessment ? "Assessment" : `Ch. ${stepIndex + 1}`}
              </span>
            </div>
            <div className="hidden md:flex md:items-center md:space-x-6">
              <Link
                href="/courses/medication-home-care/overview"
                className="text-sm text-teal-700 hover:text-teal-900 font-medium"
              >
                ← Course overview
              </Link>
              <Link
                href="/courses"
                className="text-gray-600 hover:text-teal-600 px-3 py-2 rounded-md text-sm font-medium"
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
          className={`fixed md:sticky md:top-16 top-0 left-0 z-[95] w-72 max-w-[85vw] h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)] bg-white border-r border-gray-200 overflow-y-auto transform transition-transform duration-200 ease-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          <div className="p-4 border-b border-gray-100 flex justify-between items-center md:block">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                Course menu
              </p>
              <p className="text-sm font-semibold text-gray-900 mt-1">
                Prompting &amp; medication
              </p>
            </div>
            <button
              type="button"
              className="md:hidden p-2 text-gray-500"
              aria-label="Close menu"
              onClick={() => setSidebarOpen(false)}
            >
              <i className="fas fa-times" aria-hidden />
            </button>
          </div>
          <nav className="p-3" aria-label="Chapters">
            <p className="text-xs font-semibold text-gray-500 px-2 mb-2">Chapters</p>
            <div className="space-y-0.5">
              {chapters.map((chapter, i) => {
                const done = completed.has(i);
                const active = i === stepIndex && !isAssessment;
                return (
                  <button
                    key={chapter.id}
                    type="button"
                    className={`learning-chapter-btn w-full text-left px-3 py-2.5 rounded-lg text-sm border transition-colors ${
                      active
                        ? "bg-teal-50 border-teal-200 text-teal-900 font-semibold"
                        : "border-transparent text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => goToStep(i)}
                  >
                    <span className="font-medium text-gray-500 w-6 inline-block">
                      {i + 1}
                    </span>
                    <span className="align-middle">{chapter.title}</span>
                    {done ? (
                      <i className="fas fa-check-circle text-green-600 float-right mt-0.5" aria-hidden />
                    ) : null}
                  </button>
                );
              })}
              <button
                type="button"
                className={`learning-chapter-btn w-full text-left px-3 py-2.5 rounded-lg text-sm border mt-2 transition-colors ${
                  isAssessment
                    ? "bg-teal-50 border-teal-200 text-teal-900 font-semibold"
                    : "border-transparent text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => goToStep(chapters.length)}
              >
                <span className="font-medium text-gray-500 w-6 inline-block">
                  <i className="fas fa-clipboard-check" aria-hidden />
                </span>{" "}
                Assessment
              </button>
            </div>
          </nav>
          <div className="p-4 border-t border-gray-100 text-xs text-gray-500">
            <p>
              Reference URLs (Florence) are listed in{" "}
              <code className="bg-gray-100 px-1 rounded">data/chapters.json</code> for mapping.
            </p>
          </div>
        </aside>

        <main className="flex-1 min-w-0 p-4 md:p-8 lg:pl-8 pb-28 md:pb-32">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              <p className="text-sm text-gray-600 mt-1">{meta}</p>
              <p className="sr-only" aria-live="polite">
                {title}. {meta}.
              </p>
            </div>
            <div className="w-full sm:w-56">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Progress</span>
                <span aria-live="polite">{pct}%</span>
              </div>
              <div
                className="h-2 bg-gray-200 rounded-full overflow-hidden"
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
            learningOutcomes={course.learningOutcomes}
            estimatedMinutes={isAssessment ? 5 : 3}
            contentBannerSrc={isAssessment ? undefined : contentBannerForChapter(stepIndex)}
          >
            <div
              ref={bodyRef}
              className="max-w-none text-gray-800 leading-relaxed [&_h3]:text-lg [&_h3]:font-semibold [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_a]:text-teal-700 [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-teal-900"
              dangerouslySetInnerHTML={{ __html: bodyHtml }}
            />
          </ActiveLearningChrome>
        </main>
      </div>

      <footer
        id="learningFooterNav"
        className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white safe-area-pb"
        role="navigation"
        aria-label="Chapter navigation"
      >
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-3 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 sm:gap-4">
          <button
            type="button"
            disabled={stepIndex === 0}
            onClick={prev}
            className="justify-self-start px-3 sm:px-5 py-2.5 rounded-lg border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 active:scale-[0.98] transition-transform disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
          >
            <i className="fas fa-chevron-left mr-1 sm:mr-2" aria-hidden />
            <span className="hidden sm:inline">Previous</span>
            <span className="sm:hidden">Prev</span>
          </button>
          <p className="text-center text-xs sm:text-sm text-gray-500 min-w-0 truncate px-1">
            {isAssessment
              ? `Assessment • ${totalSteps} / ${totalSteps}`
              : `Step ${stepIndex + 1} of ${totalSteps}`}
          </p>
          <button
            type="button"
            onClick={next}
            className="justify-self-end px-3 sm:px-5 py-2.5 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700 active:scale-[0.98] transition-transform shadow-sm whitespace-nowrap min-w-[5.5rem] sm:min-w-0"
          >
            <span>{isLast ? "Finish" : "Next"}</span>
            <i
              className={`ml-1 sm:ml-2 ${isLast ? "fas fa-check" : "fas fa-chevron-right"}`}
              aria-hidden
            />
          </button>
        </div>
      </footer>
    </>
  );
}
