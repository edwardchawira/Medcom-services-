import { redirect } from "next/navigation";
import { MedicationCourseReader } from "@/components/MedicationCourseReader";

function validStep(s: string): boolean {
  if (s === "assessment") return true;
  const n = parseInt(s, 10);
  return n >= 1 && n <= 15;
}

export default async function MedicationLearnStepPage({
  params,
}: {
  params: Promise<{ step: string }>;
}) {
  const { step } = await params;
  if (!validStep(step)) {
    redirect("/courses/medication-home-care/learn/1");
  }
  return <MedicationCourseReader stepParam={step} />;
}
