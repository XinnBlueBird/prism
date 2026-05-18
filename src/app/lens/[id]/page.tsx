import { notFound } from "next/navigation";
import { getLens, LENSES } from "@/lib/lenses";
import { LensRunner } from "@/components/lens-runner";

export function generateStaticParams() {
  return LENSES.filter((l) => l.status === "available").map((l) => ({
    id: l.id,
  }));
}

export default async function LensPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lens = getLens(id);
  if (!lens || lens.status !== "available") notFound();
  return <LensRunner lens={lens} />;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lens = getLens(id);
  if (!lens) return { title: "Lens not found · Prism" };
  return {
    title: `${lens.name} · Prism`,
    description: lens.description,
  };
}
