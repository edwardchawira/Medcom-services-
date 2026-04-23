"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { MedicationCheckpoint } from "@/lib/medicationCheckpoints";

type Props = {
  checkpoint: MedicationCheckpoint;
  onPassed: () => void;
  onStay: () => void;
};

export function CheckpointModal({ checkpoint, onPassed, onStay }: Props) {
  const titleId = useId();
  const descId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [showWrong, setShowWrong] = useState(false);
  const [passed, setPassed] = useState(false);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    dialogRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !passed) {
        e.preventDefault();
        onStay();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onStay, passed]);

  function pick(key: string) {
    if (passed) return;
    setSelected(key);
    setShowWrong(false);
    const opt = checkpoint.options.find((o) => o.key === key);
    if (opt?.isCorrect) {
      setPassed(true);
    } else {
      setShowWrong(true);
    }
  }

  function handleContinue() {
    if (!passed) return;
    onPassed();
  }

  return (
    <div
      className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-4 sm:p-6"
      role="presentation"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        aria-hidden
        onClick={() => !passed && onStay()}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        tabIndex={-1}
        className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl ring-1 ring-black/10 outline-none"
      >
        <div className="border-b border-teal-100 bg-gradient-to-r from-teal-50 to-white px-5 py-4 rounded-t-2xl">
          <p className="text-xs font-bold uppercase tracking-wide text-teal-800">
            Quick checkpoint
          </p>
          <h2 id={titleId} className="text-lg font-bold text-slate-900 mt-1">
            Before you continue
          </h2>
          <p id={descId} className="text-sm text-slate-600 mt-1">
            One question to strengthen what you&apos;ve just covered. You need the best answer to
            move on. You can retry as needed.
          </p>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-base font-medium text-slate-900 leading-snug">{checkpoint.question}</p>

          <div className="space-y-2" role="radiogroup" aria-label="Checkpoint answers">
            {checkpoint.options.map((o) => {
              const isSel = selected === o.key;
              const correct = o.isCorrect && isSel && passed;
              const wrong = isSel && showWrong && !o.isCorrect;
              return (
                <button
                  key={o.key}
                  type="button"
                  role="radio"
                  aria-checked={isSel}
                  disabled={passed}
                  onClick={() => pick(o.key)}
                  className={`w-full text-left rounded-xl border-2 px-4 py-3 text-sm transition-all duration-150 ${
                    correct
                      ? "border-green-500 bg-green-50 text-green-900 ring-2 ring-green-200"
                      : wrong
                        ? "border-amber-400 bg-amber-50 text-amber-950"
                        : isSel
                          ? "border-teal-500 bg-teal-50 text-teal-950"
                          : "border-slate-200 bg-white hover:border-teal-300 hover:bg-teal-50/40 text-slate-800"
                  } ${passed && !isSel ? "opacity-50" : ""}`}
                >
                  <span className="font-semibold text-slate-500 mr-2">{o.key.toUpperCase()}.</span>
                  {o.label}
                </button>
              );
            })}
          </div>

          {showWrong && !passed ? (
            <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              <i className="fas fa-info-circle mr-1.5" aria-hidden />
              {checkpoint.hintWrong}
            </p>
          ) : null}

          {passed ? (
            <p className="text-sm text-green-800 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
              <i className="fas fa-check-circle mr-1.5" aria-hidden />
              {checkpoint.successMessage}
            </p>
          ) : null}

          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end pt-2">
            <button
              type="button"
              onClick={onStay}
              className="px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50"
            >
              Stay on this chapter
            </button>
            <button
              type="button"
              onClick={handleContinue}
              disabled={!passed}
              className="px-4 py-2.5 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            >
              Continue to next section
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
