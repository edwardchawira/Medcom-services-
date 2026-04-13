import { Metadata } from "next";
import { MedicationOverview } from "@/components/MedicationOverview";

export const metadata: Metadata = {
  title: "Prompting and assisting with medication | Overview | Medcom",
};

export default function MedicationOverviewPage() {
  return <MedicationOverview />;
}
