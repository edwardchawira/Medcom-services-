import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteNav } from "@/components/SiteNav";
import { collections } from "@/lib/siteData";

export const metadata: Metadata = {
  title: "Collections | Medcom",
};

export default function CollectionsPage() {
  return (
    <>
      <SiteNav activeOverride="/collections" />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Collections</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((c) => (
            <article
              key={c.id}
              className="collection-card bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={c.thumbnail}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width:768px) 100vw, 33vw"
                  unoptimized
                />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{c.name}</h3>
                <div className="flex justify-between text-sm text-gray-600 mb-4">
                  <span>{c.courses} Courses</span>
                  <span>{c.hours} hours</span>
                </div>
                <Link
                  href="/courses"
                  className="mt-auto w-full block text-center border-2 border-teal-600 text-teal-600 py-2 rounded-md hover:bg-teal-600 hover:text-white transition-colors font-medium"
                >
                  Get started
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>
    </>
  );
}
