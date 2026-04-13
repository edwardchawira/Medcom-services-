import { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { userProgress } from "@/lib/siteData";

export const metadata: Metadata = {
  title: "My Learning | Medcom",
};

export default function MyLearningPage() {
  return (
    <>
      <SiteNav activeOverride="/my-learning" />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">My Learning</h1>
        <div className="card overflow-hidden">
          <table className="w-full" id="progressTable">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">
                  Course
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {userProgress.map((item) => (
                <tr
                  key={item.course}
                  className="border-t border-gray-200 table-row-hover transition-colors"
                >
                  <td className="px-4 py-3 text-gray-900">{item.course}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        item.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
