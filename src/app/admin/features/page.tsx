import { db } from "@/lib/db";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeatureActionsMenu } from "./feature-actions-menu";

const typeColors: Record<string, string> = {
  BOOLEAN: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  NUMBER: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

export default async function AdminFeaturesPage() {
  const features = await db.feature.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { planFeatures: true, featureOverrides: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Features</h1>
          <p className="text-zinc-400 mt-1">{features.length} feature definitions</p>
        </div>
        <Link href="/admin/features/new">
          <Button id="new-feature-btn" className="bg-violet-600 hover:bg-violet-700 text-white gap-2">
            <Plus className="h-4 w-4" /> New Feature
          </Button>
        </Link>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Feature</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Default</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Plans</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Overrides</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-zinc-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {features.map((feature) => (
              <tr key={feature.id} className="hover:bg-zinc-800/50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-medium text-white">{feature.name}</p>
                  <p className="text-xs text-zinc-500 font-mono">{feature.key}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${typeColors[feature.type]}`}>
                    {feature.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-zinc-300 font-mono text-xs">{feature.defaultValue}</td>
                <td className="px-6 py-4 text-zinc-300">{feature._count.planFeatures}</td>
                <td className="px-6 py-4 text-zinc-300">{feature._count.featureOverrides}</td>
                <td className="px-6 py-4 text-right">
                  <FeatureActionsMenu featureId={feature.id} featureName={feature.name} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
