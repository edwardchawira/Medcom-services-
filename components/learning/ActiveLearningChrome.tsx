"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import type { ReactNode } from "react";

type Props = {
  stepKey: string;
  stepIndex: number;
  totalContentSteps: number;
  isAssessment: boolean;
  chapterTitle?: string;
  learningOutcomes: string[];
  estimatedMinutes?: number;
  /** Optional section banner (SVG) above chapter HTML */
  contentBannerSrc?: string;
  children: ReactNode;
};

/**
 * Wraps chapter HTML with evidence-informed patterns:
 * stated objectives (chunking), reflection prompt (active learning),
 * motion for orientation (without overwhelming), keyboard hint.
 */
export function ActiveLearningChrome({
  stepKey,
  stepIndex,
  totalContentSteps,
  isAssessment,
  chapterTitle,
  learningOutcomes,
  estimatedMinutes = 3,
  contentBannerSrc,
  children,
}: Props) {
  const reduceMotion = useReducedMotion();
  const duration = reduceMotion ? 0 : 0.28;
  const outcomes = learningOutcomes.length
    ? [
        learningOutcomes[stepIndex % learningOutcomes.length],
        learningOutcomes[(stepIndex + 2) % learningOutcomes.length],
      ].filter((v, i, a) => a.indexOf(v) === i)
    : [];

  return (
    <div className="space-y-4">
      <div
        className="rounded-xl border border-teal-100 bg-gradient-to-br from-teal-50/90 to-white p-4 md:p-5 shadow-sm"
        role="region"
        aria-labelledby="learning-focus-heading"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p
              id="learning-focus-heading"
              className="text-xs font-bold uppercase tracking-wide text-teal-800"
            >
              {isAssessment ? "Assessment focus" : "Learning focus"}
            </p>
            <p className="mt-1 text-sm text-gray-700">
              {isAssessment
                ? "Apply ideas from the module to short scenarios. Take your time. Accuracy matters more than speed."
                : "This section is a short learning unit. Read actively: connect each idea to your next visit or handover."}
            </p>
          </div>
          {!isAssessment ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-teal-900 ring-1 ring-teal-200/80">
              <i className="fas fa-stopwatch text-teal-600" aria-hidden />
              ~{estimatedMinutes} min read
            </span>
          ) : null}
        </div>

        {!isAssessment && outcomes.length > 0 ? (
          <ul className="mt-4 space-y-2 border-t border-teal-100/80 pt-4 text-sm text-gray-800">
            <li className="font-semibold text-gray-900">You are building toward:</li>
            {outcomes.slice(0, 2).map((o) => (
              <li key={o} className="flex gap-2 pl-0">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" aria-hidden />
                <span>{o}</span>
              </li>
            ))}
          </ul>
        ) : null}

        {chapterTitle && !isAssessment ? (
          <p className="mt-3 text-xs text-gray-500">
            Section: <span className="font-medium text-gray-700">{chapterTitle}</span> ·{" "}
            {stepIndex + 1} of {totalContentSteps}
          </p>
        ) : null}
      </div>

      <p className="text-xs text-gray-500 md:text-sm">
        <kbd className="rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[0.7rem] font-sans text-gray-700">
          ←
        </kbd>{" "}
        /{" "}
        <kbd className="rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[0.7rem] font-sans text-gray-700">
          →
        </kbd>{" "}
        to move between sections when not typing in a field.
      </p>

      <AnimatePresence mode="wait" initial={false}>
        <motion.article
          key={stepKey}
          layout
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
          transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden ring-1 ring-black/[0.03]"
        >
          <div className="learning-content p-6 md:p-8">
            {contentBannerSrc && !isAssessment ? (
              <div className="mb-6 overflow-hidden rounded-xl border border-teal-100 bg-teal-50/30 shadow-inner">
                <Image
                  src={contentBannerSrc}
                  alt=""
                  width={720}
                  height={200}
                  className="h-36 w-full object-cover object-center sm:h-40"
                  unoptimized
                />
              </div>
            ) : null}
            {children}
          </div>
        </motion.article>
      </AnimatePresence>

      {!isAssessment ? (
        <details className="group rounded-xl border border-amber-100 bg-amber-50/50 p-4 text-sm text-amber-950 shadow-sm open:ring-1 open:ring-amber-200/60">
          <summary className="cursor-pointer list-none font-semibold text-amber-900 outline-none marker:content-none [&::-webkit-details-marker]:hidden">
            <span className="inline-flex items-center gap-2">
              <i className="fas fa-lightbulb text-amber-600" aria-hidden />
              Pause & reflect (30 seconds)
              <i
                className="fas fa-chevron-down ml-auto text-xs transition-transform group-open:rotate-180"
                aria-hidden
              />
            </span>
          </summary>
          <p className="mt-3 text-amber-950/90 leading-relaxed">
            In one sentence, what will you do differently (or watch for) on your next shift because
            of this section? Stating it aloud or writing it down improves retention (active recall).
          </p>
        </details>
      ) : null}
    </div>
  );
}
