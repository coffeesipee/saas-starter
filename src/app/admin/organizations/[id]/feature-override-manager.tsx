"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { setFeatureOverride, removeFeatureOverride } from "@/app/actions/admin/organizations";
import { toast } from "sonner";
import { Zap, X } from "lucide-react";

interface Feature { id: string; key: string; name: string; type: string; defaultValue: string; }
interface Override { featureId: string; value: string; feature: Feature; }
interface Org { id: string; featureOverrides: Override[]; }

export function FeatureOverrideManager({ org, features }: { org: Org; features: Feature[] }) {
  const overrideMap = new Map(org.featureOverrides.map((o) => [o.featureId, o.value]));
  const [overrides, setOverrides] = useState<Map<string, string>>(overrideMap);
  const [saving, setSaving] = useState<string | null>(null);

  async function handleSet(featureId: string, value: string) {
    setSaving(featureId);
    try {
      await setFeatureOverride(org.id, featureId, value);
      setOverrides((prev) => new Map(prev).set(featureId, value));
      toast.success("Override saved");
    } catch { toast.error("Failed to save override"); }
    finally { setSaving(null); }
  }

  async function handleRemove(featureId: string) {
    setSaving(featureId);
    try {
      await removeFeatureOverride(org.id, featureId);
      setOverrides((prev) => { const m = new Map(prev); m.delete(featureId); return m; });
      toast.success("Override removed");
    } catch { toast.error("Failed to remove override"); }
    finally { setSaving(null); }
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900">
      <div className="px-6 py-4 border-b border-zinc-800 flex items-center gap-2">
        <Zap className="h-4 w-4 text-violet-400" />
        <h2 className="text-sm font-semibold text-white">Feature Overrides</h2>
        <span className="ml-auto text-xs text-zinc-500">{overrides.size} active override{overrides.size !== 1 ? "s" : ""}</span>
      </div>
      <div className="divide-y divide-zinc-800">
        {features.map((feature) => {
          const currentValue = overrides.get(feature.id);
          const isSaving = saving === feature.id;
          return (
            <div key={feature.id} className="px-6 py-3 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{feature.name}</p>
                <p className="text-xs text-zinc-500">{feature.key}</p>
              </div>
              <div className="flex items-center gap-2">
                {feature.type === "BOOLEAN" ? (
                  <Select
                    value={currentValue ?? ""}
                    onValueChange={(v) => handleSet(feature.id, v as string)}
                    disabled={isSaving}
                  >
                    <SelectTrigger className="w-28 bg-zinc-800 border-zinc-700 text-white text-xs h-8">
                      <SelectValue placeholder={`default: ${feature.defaultValue}`} />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
                      <SelectItem value="true">true</SelectItem>
                      <SelectItem value="false">false</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    type="number"
                    defaultValue={currentValue ?? feature.defaultValue}
                    className="w-28 bg-zinc-800 border-zinc-700 text-white text-xs h-8"
                    onBlur={(e) => { if (e.target.value) handleSet(feature.id, e.target.value); }}
                    disabled={isSaving}
                  />
                )}
                {currentValue !== undefined && (
                  <button
                    onClick={() => handleRemove(feature.id)}
                    disabled={isSaving}
                    className="text-zinc-500 hover:text-red-400 transition-colors"
                    title="Remove override"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                {currentValue !== undefined && (
                  <span className="text-xs text-violet-400">override</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
