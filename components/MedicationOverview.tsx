"use client";

import Link from "next/link";
import { useEffect } from "react";
import { SiteNav } from "@/components/SiteNav";

const chapterLinks = [
  { href: "#ch-1", label: "Overview", overview: true },
  { href: "#ch-1", label: "1. Introduction" },
  { href: "#ch-2", label: "2. What are your responsibilities?" },
  { href: "#ch-3", label: "3. What is prompting and assisting with medication?" },
  { href: "#ch-4", label: "4. Why may a person need assistance?" },
  { href: "#ch-5", label: "5. Understanding the needs of service users" },
  { href: "#ch-6", label: "6. How is medication stored in home care?" },
  { href: "#ch-7", label: "7. What are adverse drug reactions (ADR) and drug interactions?" },
  { href: "#ch-8", label: "8. What about refusals?" },
  { href: "#ch-9", label: "9. Documentation and record keeping" },
  { href: "#ch-10", label: "10. Ordering, transporting, storing, and disposing" },
  { href: "#ch-11", label: "11. Ethical considerations" },
  { href: "#ch-12", label: "12. Simple scenarios" },
  { href: "#ch-13", label: "13. Summary" },
  { href: "#ch-14", label: "14. Review & Reflect" },
  { href: "#ch-15", label: "15. What to expect from the assessment" },
];

export function MedicationOverview() {
  useEffect(() => {
    const navLinks = document.querySelectorAll<HTMLAnchorElement>(
      "#chapterNav a.chapter-nav-link, a.overview-link"
    );
    const sections = document.querySelectorAll(".chapter-section");

    function setActive(id: string) {
      navLinks.forEach((a) => {
        const href = a.getAttribute("href");
        a.classList.toggle("active", href === id);
      });
    }

    function scrollToHash() {
      const h = window.location.hash;
      if (!h || h === "#") {
        setActive("#ch-1");
        return;
      }
      const el = document.querySelector(h);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        setActive(h);
      }
    }

    const hashClick = (e: MouseEvent) => {
      const a = e.currentTarget as HTMLAnchorElement;
      const href = a.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        window.history.pushState(null, "", href);
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
        setActive(href);
      }
    };

    navLinks.forEach((a) => a.addEventListener("click", hashClick));
    window.addEventListener("hashchange", scrollToHash);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = "#" + entry.target.getAttribute("id");
          if ((entry.target as HTMLElement).classList.contains("chapter-section")) {
            setActive(id);
          }
        });
      },
      { rootMargin: "-40% 0px -45% 0px", threshold: 0 }
    );
    sections.forEach((sec) => observer.observe(sec));

    scrollToHash();

    return () => {
      navLinks.forEach((a) => a.removeEventListener("click", hashClick));
      window.removeEventListener("hashchange", scrollToHash);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <SiteNav activeOverride="/courses" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-teal-600">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/courses" className="hover:text-teal-600">
            Courses
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">
            Prompting and assisting with medication in Home Care
          </span>
        </nav>

        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Prompting and assisting with medication in Home Care
          </h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <span>
              <i className="fas fa-clock mr-1 text-teal-600" aria-hidden />
              20–30 minutes
            </span>
            <span>
              <i className="fas fa-book mr-1 text-teal-600" aria-hidden />
              15 chapters
            </span>
            <span>
              <i className="fas fa-certificate mr-1 text-teal-600" aria-hidden />
              CPD accredited
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <aside className="lg:col-span-4 xl:col-span-3">
            <div className="overview-card p-5 sticky top-24">
              <div className="menu-heading">Course menu</div>
              <a
                href="#ch-1"
                data-chapter="1"
                className="chapter-nav-link mb-1 overview-link"
              >
                Overview
              </a>
              <div className="menu-heading mt-4 mb-2">Chapters</div>
              <nav
                className="space-y-0.5 max-h-[70vh] overflow-y-auto pr-1"
                id="chapterNav"
                aria-label="Course chapters"
              >
                {chapterLinks.slice(1).map((c) => (
                  <a key={c.href} href={c.href} className="chapter-nav-link">
                    {c.label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <main className="lg:col-span-8 xl:col-span-9 space-y-6">
            <section id="ch-1" className="chapter-section overview-card p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Introduction</h2>
              <p className="text-gray-700 leading-relaxed text-sm md:text-base mb-4">
                Welcome to the{" "}
                <strong>Medcom Prompting and assisting with medication in Home Care</strong>{" "}
                course. This module gives you essential knowledge for safe, effective prompting
                and assisting with medication in home care in the UK.
              </p>
              <p className="text-sm text-teal-800 mb-4">
                <Link
                  href="/courses/medication-home-care/learn/1"
                  className="font-semibold underline hover:text-teal-900"
                >
                  Open full interactive introduction →
                </Link>
              </p>
            </section>

            {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((n) => (
              <section
                key={n}
                id={`ch-${n}`}
                className="chapter-section overview-card p-6 md:p-8"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Chapter {n} overview
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm">
                  Use <strong>Continue training</strong> below to open the interactive reader
                  for this module. You can jump between chapters from the course menu.
                </p>
                <p className="mt-3 text-sm">
                  <Link
                    href={`/courses/medication-home-care/learn/${n}`}
                    className="text-teal-700 font-semibold underline hover:text-teal-900"
                  >
                    Start chapter {n} in the reader →
                  </Link>
                </p>
              </section>
            ))}

            <section id="assessment" className="chapter-section overview-card p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Assessment</h2>
              <p className="text-gray-700 leading-relaxed text-sm mb-4">
                Complete the chapters, then finish with the assessment step in the reader.
              </p>
              <Link
                href="/courses/medication-home-care/learn/assessment"
                className="inline-flex text-teal-700 font-semibold underline hover:text-teal-900"
              >
                Open assessment step →
              </Link>
            </section>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                href="/courses/medication-home-care/learn/1"
                className="inline-flex justify-center items-center px-6 py-3 rounded-lg font-semibold text-white bg-teal-600 hover:bg-teal-700 transition-colors shadow-sm"
              >
                Continue training
              </Link>
              <Link
                href="/courses"
                className="inline-flex justify-center items-center px-6 py-3 rounded-lg font-semibold border-2 border-teal-600 text-teal-700 hover:bg-teal-50 transition-colors"
              >
                Back to courses
              </Link>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
