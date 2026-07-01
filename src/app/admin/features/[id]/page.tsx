import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { FeatureEditForm } from "./feature-edit-form";

export default async function AdminFeatureDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const feature = await db.feature.findUnique({ where: { id } });
  if (!feature) notFound();

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <Link href="/admin/features" className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-white mb-4">
          <ChevronLeft className="h-4 w-4" /> Back
        </Link>
        <h1 className="text-2xl font-bold text-white">{feature.name}</h1>
        <p className="text-zinc-400 mt-1 font-mono text-sm">{feature.key}</p>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <h2 className="text-sm font-semibold text-white mb-4">Edit Feature</h2>
        <FeatureEditForm feature={feature} />
      </div>
    </div>
  );
}
