import { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { CoursesExplorer } from "@/components/CoursesExplorer";

export const metadata: Metadata = {
  title: "Courses | Medcom",
};

export default function CoursesPage() {
  return (
    <>
      <SiteNav activeOverride="/courses" />
      <CoursesExplorer />
    </>
  );
}
