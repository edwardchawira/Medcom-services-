"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AccountMenu } from "@/components/AccountMenu";
import { useMe } from "@/lib/auth/useMe";

const links = [
  { href: "/", label: "Home", icon: "fa-home" },
  { href: "/courses", label: "Courses", icon: "fa-book-open" },
  { href: "/collections", label: "Collections", icon: "fa-layer-group" },
  { href: "/my-learning", label: "My Learning", icon: "fa-graduation-cap" },
  { href: "/portfolio", label: "Portfolio", icon: "fa-briefcase" },
] as const;

export function SiteNav({ activeOverride }: { activeOverride?: string }) {
  const pathname = usePathname();
  const { data } = useMe();
  const authed = !!(data && "user" in data && data.user);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-center">
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
            <div className="ml-3 sm:ml-6 flex min-w-0 flex-1 items-center gap-1 sm:gap-3 md:gap-5 overflow-x-auto overflow-y-hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {links.map(({ href, label, icon }) => {
                const active =
                  activeOverride === href ||
                  (href === "/"
                    ? pathname === "/"
                    : pathname === href || pathname.startsWith(href + "/"));
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`nav-link shrink-0 px-2 sm:px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                      active
                        ? "active text-slate-600"
                        : "text-slate-600 hover:text-teal-600"
                    }`}
                  >
                    <i className={`fas ${icon} mr-1.5 sm:mr-2`} aria-hidden />
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            {authed ? (
              <>
                <Link
                  href="/courses/upload"
                  aria-label="Upload a course"
                  className={`nav-link inline-flex items-center rounded-md px-2.5 sm:px-3 py-2 text-sm font-semibold transition-colors whitespace-nowrap ${
                    pathname.startsWith("/courses/upload")
                      ? "text-teal-800 bg-teal-50 ring-1 ring-teal-200/80"
                      : "text-teal-700 hover:text-teal-900 hover:bg-teal-50/90"
                  }`}
                >
                  <i className="fas fa-cloud-arrow-up mr-1.5 sm:mr-2" aria-hidden />
                  Upload
                </Link>
                <AccountMenu />
              </>
            ) : (
              <Link
                href="/welcome"
                className="nav-link shrink-0 text-slate-600 px-2 sm:px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-teal-600 whitespace-nowrap"
              >
                <i className="fas fa-right-to-bracket mr-1.5 sm:mr-2" aria-hidden />
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
