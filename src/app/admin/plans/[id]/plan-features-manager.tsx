"use client";

import { useState } from "react";
import { setPlanFeature, removePlanFeature } from "@/app/actions/admin/plans";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Zap, X, Check } from "lucide-react";

interface Feature { id: string; key: string; name: string; type: string; }
interface PlanFeature { featureId: string; value: string; feature: Feature; }
interface Plan { id: string; planFeatures: PlanFeature[]; }

export function PlanFeaturesManager({ plan, allFeatures }: { plan: Plan; allFeatures: Feature[] }) {
  const featureMap = new Map(plan.planFeatures.map((pf) => [pf.featureId, pf.value]));
  const [values, setValues] = useState<Map<string, string>>(featureMap);
  const [saving, setSaving] = useState<string | null>(null);

  async function handleSet(featureId: string, value: string) {
    setSaving(featureId);
    try {
      await setPlanFeature(plan.id, featureId, value);
      setValues((prev) => new Map(prev).set(featureId, value));
      toast.success("Feature updated");
    } catch { toast.error("Failed to update feature"); }
    finally { setSaving(null); }
  }

  async function handleRemove(featureId: string) {
    setSaving(featureId);
    try {
      await removePlanFeature(plan.id, featureId);
      setValues((prev) => { const m = new Map(prev); m.delete(featureId); return m; });
      toast.success("Feature removed from plan");
    } catch { toast.error("Failed to remove feature"); }
    finally { setSaving(null); }
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900">
      <div className="px-6 py-4 border-b border-zinc-800 flex items-center gap-2">
        <Zap className="h-4 w-4 text-violet-400" />
        <h2 className="text-sm font-semibold text-white">Plan Features</h2>
        <span className="ml-auto text-xs text-zinc-500">{values.size}/{allFeatures.length} included</span>
      </div>
      <div className="divide-y divide-zinc-800">
        {allFeatures.map((feature) => {
          const currentValue = values.get(feature.id);
          const isIncluded = currentValue !== undefined;
          const isSaving = saving === feature.id;

          return (
            <div key={feature.id} className={`px-6 py-3 flex items-center gap-4 transition-colors ${isIncluded ? "bg-violet-500/5" : ""}`}>
              <div className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${isIncluded ? "bg-violet-500" : "bg-zinc-700"}`}>
                {isIncluded && <Check className="h-2.5 w-2.5 text-white" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white">{feature.name}</p>
                <p className="text-xs text-zinc-500">{feature.key} · {feature.type}</p>
              </div>
              <div className="flex items-center gap-2">
                {feature.type === "BOOLEAN" ? (
                  <Select
                    value={currentValue ?? ""}
                    onValueChange={(v) => handleSet(feature.id, v as string)}
                    disabled={isSaving}
                  >
                    <SelectTrigger className="w-24 bg-zinc-800 border-zinc-700 text-white text-xs h-8">
                      <SelectValue placeholder="off" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
                      <SelectItem value="true">true</SelectItem>
                      <SelectItem value="false">false</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    type="number"
                    value={currentValue ?? ""}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v) handleSet(feature.id, v);
                    }}
                    placeholder="0"
                    className="w-24 bg-zinc-800 border-zinc-700 text-white text-xs h-8"
                    disabled={isSaving}
                  />
                )}
                {isIncluded && (
                  <button onClick={() => handleRemove(feature.id)} disabled={isSaving} className="text-zinc-500 hover:text-red-400 transition-colors" title="Remove">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
