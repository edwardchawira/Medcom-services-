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
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
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
            <div className="hidden md:ml-8 md:flex md:space-x-8 items-center">
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
                    className={`nav-link px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      active
                        ? "active text-gray-600"
                        : "text-gray-600 hover:text-teal-600"
                    }`}
                  >
                    <i className={`fas ${icon} mr-2`} aria-hidden />
                    {label}
                  </Link>
                );
              })}
              {authed ? (
                <AccountMenu />
              ) : (
                <Link
                  href="/welcome"
                  className="nav-link text-gray-600 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-teal-600"
                >
                  <i className="fas fa-right-to-bracket mr-2" aria-hidden />
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
