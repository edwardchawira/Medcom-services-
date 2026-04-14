"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";

export type ChapterQuizQuestion = {
  id: string;
  sort_order: number;
  prompt: string;
  options: string[];
  correct_index: number | null;
  explanation: string;
};

function pct(n: number, d: number) {
  if (d <= 0) return 0;
  return Math.round((n / d) * 100);
}

export function ChapterQuiz({
  title = "Check your understanding",
  questions,
}: {
  title?: string;
  questions: ChapterQuizQuestion[];
}) {
  const reduceMotion = useReducedMotion();
  const t = reduceMotion ? 0 : 0.18;

  const sorted = useMemo(
    () => [...questions].sort((a, b) => a.sort_order - b.sort_order),
    [questions]
  );

  const [open, setOpen] = useState(true);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [submitted, setSubmitted] = useState(false);

  const total = sorted.length;
  const answeredCount = sorted.reduce((acc, q) => acc + (answers[q.id] != null ? 1 : 0), 0);
  const score = sorted.reduce((acc, q) => {
    const a = answers[q.id];
    if (a == null) return acc;
    if (q.correct_index == null) return acc;
    return acc + (a === q.correct_index ? 1 : 0);
  }, 0);

  return (
    <section className="mt-8 rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full px-4 sm:px-6 py-4 flex items-center justify-between gap-4 bg-gradient-to-r from-teal-50 to-white hover:from-teal-100/60 transition"
        aria-expanded={open}
      >
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">{title}</p>
          <p className="text-xs text-gray-600 mt-0.5">
            {submitted
              ? qScoreLabel(score, total)
              : `${answeredCount}/${total} answered • ${pct(answeredCount, total)}% ready`}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="h-2 w-24 rounded-full bg-gray-200 overflow-hidden" aria-hidden>
            <div
              className="h-full rounded-full bg-teal-600 transition-all duration-300"
              style={{ width: `${pct(answeredCount, total)}%` }}
            />
          </div>
          <i
            className={`fas fa-chevron-down text-gray-600 transition-transform ${
              open ? "rotate-180" : ""
            }`}
            aria-hidden
          />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: t, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="px-4 sm:px-6 py-5 space-y-5">
              {sorted.map((q, idx) => {
                const selected = answers[q.id] ?? null;
                const showResult = submitted && q.correct_index != null && selected != null;
                const correct = showResult ? selected === q.correct_index : null;
                return (
                  <article
                    key={q.id}
                    className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Question {idx + 1}
                        </p>
                        <h3 className="mt-1 text-sm sm:text-base font-semibold text-gray-900">
                          {q.prompt}
                        </h3>
                      </div>
                      {submitted && q.correct_index != null ? (
                        <span
                          className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
                            correct
                              ? "bg-green-50 text-green-800 ring-green-200"
                              : "bg-amber-50 text-amber-900 ring-amber-200"
                          }`}
                        >
                          <i className={`fas ${correct ? "fa-check" : "fa-circle-exclamation"}`} aria-hidden />
                          {correct ? "Correct" : "Review"}
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-4 grid gap-2">
                      {q.options.map((opt, oi) => {
                        const isSelected = selected === oi;
                        const isCorrect = submitted && q.correct_index === oi;
                        const isWrongPick =
                          submitted && q.correct_index != null && isSelected && q.correct_index !== oi;
                        return (
                          <button
                            key={`${q.id}-${oi}`}
                            type="button"
                            onClick={() => {
                              setAnswers((prev) => ({ ...prev, [q.id]: oi }));
                              setSubmitted(false);
                            }}
                            className={`w-full text-left rounded-xl border px-3 py-3 sm:px-4 sm:py-3.5 transition-all active:scale-[0.99] ${
                              isCorrect
                                ? "border-green-300 bg-green-50"
                                : isWrongPick
                                  ? "border-amber-300 bg-amber-50"
                                  : isSelected
                                    ? "border-teal-300 bg-teal-50"
                                    : "border-gray-200 hover:border-teal-200 hover:bg-gray-50"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <span
                                className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${
                                  isCorrect
                                    ? "border-green-500 bg-green-100 text-green-800"
                                    : isWrongPick
                                      ? "border-amber-500 bg-amber-100 text-amber-900"
                                      : isSelected
                                        ? "border-teal-500 bg-teal-100 text-teal-900"
                                        : "border-gray-300 bg-white text-gray-600"
                                }`}
                                aria-hidden
                              >
                                {String.fromCharCode(65 + oi)}
                              </span>
                              <span className="text-sm text-gray-900">{opt}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {submitted && q.explanation ? (
                      <p className="mt-3 text-sm text-gray-700 rounded-lg bg-gray-50 border border-gray-200 px-3 py-2">
                        {q.explanation}
                      </p>
                    ) : null}
                  </article>
                );
              })}

              <div className="flex flex-wrap gap-3 items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                <p className="text-sm text-gray-700">
                  {submitted ? (
                    <span className="font-semibold text-gray-900">{qScoreLabel(score, total)}</span>
                  ) : (
                    <span>
                      Pick an answer for each question, then submit to see feedback.
                    </span>
                  )}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAnswers({});
                      setSubmitted(false);
                    }}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-100 transition"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => setSubmitted(true)}
                    className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 transition disabled:opacity-50"
                    disabled={answeredCount < total}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}

function qScoreLabel(score: number, total: number) {
  if (total <= 0) return "No questions yet";
  return `Score: ${score}/${total}`;
}

