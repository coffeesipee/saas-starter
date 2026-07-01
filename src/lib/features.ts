import { db } from "@/lib/db";
import type { FeatureType } from "@/generated/prisma";

/**
 * Resolves a feature value for an organization with priority:
 * 1. FeatureOverride (custom per-org)
 * 2. PlanFeature (plan default)
 * 3. Feature.defaultValue (fallback)
 */
export async function getFeatureValue(
  organizationId: string,
  featureKey: string
): Promise<{ value: string; type: FeatureType }> {
  // 1. Check override first
  const override = await db.featureOverride.findUnique({
    where: {
      organizationId_featureId: {
        organizationId,
        featureId: (await db.feature.findUnique({ where: { key: featureKey } }))?.id ?? "",
      },
    },
    include: { feature: true },
  });

  if (override) {
    return { value: override.value, type: override.feature.type };
  }

  // 2. Get plan default
  const subscription = await db.subscription.findUnique({
    where: { organizationId },
    include: {
      plan: {
        include: {
          planFeatures: {
            include: { feature: true },
          },
        },
      },
    },
  });

  if (subscription) {
    const planFeature = subscription.plan.planFeatures.find(
      (pf) => pf.feature.key === featureKey
    );
    if (planFeature) {
      return { value: planFeature.value, type: planFeature.feature.type };
    }
  }

  // 3. Fallback to feature default
  const feature = await db.feature.findUnique({ where: { key: featureKey } });
  return {
    value: feature?.defaultValue ?? "false",
    type: feature?.type ?? "BOOLEAN",
  };
}

/** Returns true/false for a BOOLEAN feature gate */
export async function canAccess(
  organizationId: string,
  featureKey: string
): Promise<boolean> {
  const resolved = await getFeatureValue(organizationId, featureKey);
  return resolved.value === "true";
}

/** Returns numeric value for a NUMBER feature */
export async function getFeatureLimit(
  organizationId: string,
  featureKey: string
): Promise<number> {
  const resolved = await getFeatureValue(organizationId, featureKey);
  return parseInt(resolved.value, 10) ?? 0;
}

/** Returns all resolved features for an org (including overrides) */
export async function getAllFeatureFlags(organizationId: string) {
  const features = await db.feature.findMany();

  const subscription = await db.subscription.findUnique({
    where: { organizationId },
    include: {
      plan: {
        include: {
          planFeatures: { include: { feature: true } },
        },
      },
    },
  });

  const overrides = await db.featureOverride.findMany({
    where: { organizationId },
    include: { feature: true },
  });

  const overrideMap = new Map(
    overrides.map((o) => [o.feature.key, o.value])
  );

  return features.map((feature) => {
    let value: string;

    if (overrideMap.has(feature.key)) {
      value = overrideMap.get(feature.key)!;
    } else if (subscription) {
      const planFeature = subscription.plan.planFeatures.find(
        (pf) => pf.feature.key === feature.key
      );
      value = planFeature?.value ?? feature.defaultValue;
    } else {
      value = feature.defaultValue;
    }

    return {
      key: feature.key,
      name: feature.name,
      type: feature.type,
      value,
    };
  });
}