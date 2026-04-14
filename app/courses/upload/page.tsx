import type { Metadata } from "next";
import { CourseUploadForm } from "@/components/CourseUploadForm";

export const metadata: Metadata = {
  title: "Upload a course | Medcom",
};

export default function CourseUploadPage() {
  return <CourseUploadForm />;
}
