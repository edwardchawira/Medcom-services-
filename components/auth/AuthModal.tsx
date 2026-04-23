"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type Mode = "signup" | "login";

export function AuthModal({
  open,
  initialMode = "signup",
  onClose,
}: {
  open: boolean;
  initialMode?: Mode;
  onClose: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const duration = reduceMotion ? 0 : 0.18;

  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const [mode, setMode] = useState<Mode>(initialMode);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setMode(initialMode);
    setError(null);
    setHint(null);
  }, [initialMode, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, open]);

  async function submit() {
    setError(null);
    setHint(null);
    setLoading(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName.trim(),
            },
          },
        });
        if (error) throw error;

        if (!data.session) {
          setHint("Check your email to confirm your account, then log in.");
          setMode("login");
          return;
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }

      window.location.href = "/";
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration }}
        className="fixed inset-0 z-[200] bg-black/45 backdrop-blur-[2px]"
        aria-hidden
        onClick={onClose}
      />
      <motion.div
        key="dialog"
        initial={reduceMotion ? false : { opacity: 0, y: 14, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduceMotion ? undefined : { opacity: 0, y: 10, scale: 0.985 }}
        transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-0 z-[210] flex items-end sm:items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-label={mode === "signup" ? "Sign up" : "Log in"}
      >
        <div
          className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/10"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="border-b border-teal-100 bg-gradient-to-r from-teal-50 to-white px-5 py-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-teal-800">
                  {mode === "signup" ? "Create account" : "Welcome back"}
                </p>
                <h2 className="text-lg font-bold text-slate-900 mt-1">
                  {mode === "signup" ? "Sign up to Medcom" : "Log in to Medcom"}
                </h2>
              </div>
              <button
                type="button"
                className="h-9 w-9 rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition"
                onClick={onClose}
                aria-label="Close"
              >
                <i className="fas fa-times text-slate-500" aria-hidden />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-white/60 p-1 ring-1 ring-teal-100">
              <button
                type="button"
                onClick={() => setMode("signup")}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  mode === "signup"
                    ? "bg-teal-600 text-white shadow-sm"
                    : "text-teal-800 hover:bg-teal-50"
                }`}
              >
                Sign up
              </button>
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  mode === "login"
                    ? "bg-teal-600 text-white shadow-sm"
                    : "text-teal-800 hover:bg-teal-50"
                }`}
              >
                Log in
              </button>
            </div>
          </div>

          <div className="p-5 space-y-4">
            {mode === "signup" ? (
              <label className="block">
                <span className="text-sm font-semibold text-slate-800">Full name</span>
                <input
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  autoComplete="name"
                  placeholder="e.g. Peter Usieki"
                />
              </label>
            ) : null}

            <label className="block">
              <span className="text-sm font-semibold text-slate-800">Email</span>
              <input
                type="email"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="you@example.com"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-800">Password</span>
              <input
                type="password"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                placeholder="••••••••"
              />
            </label>

            {hint ? (
              <p className="text-sm text-teal-800 bg-teal-50 border border-teal-100 rounded-xl px-4 py-3">
                <i className="fas fa-info-circle mr-1.5" aria-hidden />
                {hint}
              </p>
            ) : null}

            {error ? (
              <p className="text-sm text-rose-800 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3">
                <i className="fas fa-exclamation-triangle mr-1.5" aria-hidden />
                {error}
              </p>
            ) : null}

            <button
              type="button"
              disabled={loading || !email || !password || (mode === "signup" && !fullName.trim())}
              onClick={submit}
              className="btn-teal w-full inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? "Working..." : mode === "signup" ? "Create account" : "Log in"}
            </button>

            <p className="text-xs text-slate-500 leading-relaxed">
              By continuing you agree to basic account storage for the purpose of demo access.
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

