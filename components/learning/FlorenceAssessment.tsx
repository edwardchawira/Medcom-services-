"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";

export type FlorenceAssessmentQuestion = {
  id: string;
  /** Display tag like LO7 */
  loTag: string;
  prompt: string;
  options: string[];
  correctIndex: number | null;
};

type Page = {
  pageIndex: number;
  questions: FlorenceAssessmentQuestion[];
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function pct(n: number, d: number) {
  if (d <= 0) return 0;
  return Math.round((n / d) * 100);
}

export function FlorenceAssessment({
  title = "Final assessment",
  questions,
  questionsPerPage = 2,
}: {
  title?: string;
  questions: FlorenceAssessmentQuestion[];
  questionsPerPage?: 1 | 2;
}) {
  const reduceMotion = useReducedMotion();
  const t = reduceMotion ? 0 : 0.2;

  const pages: Page[] = useMemo(() => {
    const per = questionsPerPage;
    const out: Page[] = [];
    const sorted = [...questions];
    for (let i = 0; i < sorted.length; i += per) {
      out.push({
        pageIndex: out.length,
        questions: sorted.slice(i, i + per),
      });
    }
    return out.length > 0 ? out : [{ pageIndex: 0, questions: [] }];
  }, [questions, questionsPerPage]);

  const totalPages = pages.length;
  const [page, setPage] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});

  const current = pages[clamp(page, 0, totalPages - 1)];
  const pageLabel = `${page + 1}/${totalPages}`;
  const progress = pct(page + 1, totalPages);

  const totalQuestions = questions.length;
  const answeredCount = questions.reduce((acc, q) => acc + (answers[q.id] != null ? 1 : 0), 0);
  const score = questions.reduce((acc, q) => {
    const a = answers[q.id];
    if (a == null || q.correctIndex == null) return acc;
    return acc + (a === q.correctIndex ? 1 : 0);
  }, 0);

  function canSubmit() {
    return totalQuestions > 0 && answeredCount === totalQuestions;
  }

  return (
    <section className="mx-auto w-full max-w-[720px] pt-6 sm:pt-10">
      <h2 className="text-4xl sm:text-5xl font-medium tracking-tight text-gray-800">
        {title}
      </h2>
      <p className="mt-3 text-sm text-gray-500">-- {page + 1} of {totalPages} --</p>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={current.pageIndex}
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: t, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-5"
        >
          {current.questions.map((q) => (
            <article key={q.id} className="pt-8">
              <h3 className="text-2xl sm:text-[28px] leading-tight font-medium text-gray-900">
                {q.prompt}
              </h3>
              <p className="mt-1 text-xl sm:text-2xl text-gray-900">[{q.loTag}]</p>

              <fieldset className="mt-10 space-y-7" aria-label={q.prompt}>
                {q.options.map((opt, oi) => {
                  const selected = answers[q.id] === oi;
                  const showResult = submitted && q.correctIndex != null;
                  const correct = showResult ? oi === q.correctIndex : false;
                  const wrongPick = showResult ? selected && oi !== q.correctIndex : false;
                  const baseText = showResult && (correct || wrongPick) ? "text-gray-900" : "text-gray-800";
                  return (
                    <label
                      key={`${q.id}-${oi}`}
                      className={`flex items-start gap-4 cursor-pointer select-none ${showResult && !selected ? "opacity-60" : ""}`}
                    >
                      <input
                        type="radio"
                        name={`assess-${q.id}`}
                        checked={selected}
                        onChange={() => {
                          setAnswers((prev) => ({ ...prev, [q.id]: oi }));
                          setSubmitted(false);
                        }}
                        className="mt-1 h-5 w-5"
                      />
                      <span className={`text-base sm:text-lg leading-relaxed ${baseText}`}>
                        {opt}
                      </span>
                    </label>
                  );
                })}
              </fieldset>
            </article>
          ))}
        </motion.div>
      </AnimatePresence>

      <footer className="mt-10 flex items-center justify-between">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setPage((p) => clamp(p - 1, 0, totalPages - 1))}
            disabled={page === 0}
            className="text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-40"
          >
            Prev
          </button>
          {page < totalPages - 1 ? (
            <button
              type="button"
              onClick={() => setPage((p) => clamp(p + 1, 0, totalPages - 1))}
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setSubmitted(true)}
              disabled={!canSubmit()}
              className="text-sm font-semibold text-teal-700 hover:text-teal-900 disabled:opacity-50"
            >
              Submit Answers
            </button>
          )}
        </div>
        <p className="text-sm text-gray-600">{pageLabel}</p>
      </footer>

      {submitted ? (
        <p className="mt-3 text-sm text-gray-700">
          Score: {score}/{totalQuestions}
        </p>
      ) : null}
    </section>
  );
}

