"use client";

import { useState } from "react";
import { SiteNav } from "@/components/SiteNav";

export default function PortfolioPage() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <SiteNav activeOverride="/portfolio" />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Portfolio</h1>
        <p className="text-gray-600 mb-8 max-w-2xl">
          Showcase your certificates and achievements. This demo page mirrors the static Medcom
          portfolio experience.
        </p>
        <div className="card p-6 max-w-lg">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              id="workToggle"
              type="checkbox"
              className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              checked={open}
              onChange={(e) => setOpen(e.target.checked)}
            />
            <span className="text-gray-800 font-medium">Open to work</span>
          </label>
          <p className="text-sm text-gray-500 mt-2">Status: {open ? "ON" : "OFF"}</p>
        </div>
      </main>
    </>
  );
}
