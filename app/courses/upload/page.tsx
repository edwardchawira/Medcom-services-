import type { Metadata } from "next";
import { CourseBuilderV2 } from "@/components/CourseBuilderV2";
import { CourseUploadForm } from "@/components/CourseUploadForm";

export const metadata: Metadata = {
  title: "AI Course Builder | Medcom",
};

export default function CourseUploadPage() {
  if (process.env.NEXT_PUBLIC_AI_COURSE_BUILDER === "true") {
    return <CourseBuilderV2 />;
  }
  return <CourseUploadForm />;
}
