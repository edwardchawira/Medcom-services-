import { redirect } from "next/navigation";

export default function StaticLearnIndexPage({ params }: { params: { slug: string } }) {
  redirect(`/courses/${params.slug}/learn/1`);
}

