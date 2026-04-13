"use client";

import Image from "next/image";
import { useState } from "react";
import { PreAuthCoursesExplorer } from "@/components/PreAuthCoursesExplorer";
import { AuthModal } from "@/components/auth/AuthModal";

export default function WelcomePage() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signup" | "login">("signup");

  return (
    <main className="min-h-screen bg-[var(--bg-light)]">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <i className="fas fa-tint text-teal-600 text-xl" aria-hidden />
              <span className="text-lg font-bold">
                <span className="logo-florence">Med</span>
                <span className="logo-academy">com</span>
              </span>
            </div>

            <div id="auth-actions" className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("signup");
                    setAuthOpen(true);
                  }}
                  className="btn-teal inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                >
                  Sign up
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("login");
                    setAuthOpen(true);
                  }}
                  className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition"
                >
                  Log in
                </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <section className="card overflow-hidden mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
            <div className="p-6 sm:p-8 flex flex-col justify-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Medcom Pathway to Care collection
              </h1>
              <p className="mt-2 text-sm sm:text-base text-gray-600 max-w-prose">
                Learn the fundamentals of the adult social care sector.
              </p>
              <p className="mt-4 text-sm text-gray-700 font-medium">Free</p>
              <div className="mt-5">
                <button
                  type="button"
                  onClick={() =>
                    document
                      .getElementById("auth-actions")
                      ?.scrollIntoView({ behavior: "smooth", block: "center" })
                  }
                  className="btn-teal inline-flex items-center justify-center rounded-md px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                >
                  Get started
                </button>
              </div>
            </div>

            <div className="relative min-h-[220px] lg:min-h-[280px] bg-gray-50">
              <Image
                src="/images/collections/collection-pathway.png"
                alt=""
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 55vw"
                unoptimized
              />
            </div>
          </div>
        </section>

        <div className="flex items-center justify-center gap-2 text-gray-400 mb-6">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gray-400" />
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gray-300" />
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gray-300" />
        </div>
      </div>

      <PreAuthCoursesExplorer
        onAuthRequested={() => {
          setAuthMode("signup");
          setAuthOpen(true);
        }}
      />

      <AuthModal
        open={authOpen}
        initialMode={authMode}
        onClose={() => setAuthOpen(false)}
      />
    </main>
  );
}

