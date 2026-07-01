import { getUserMemberships } from "@/lib/memberships";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAllFeatureFlags } from "@/lib/features";
import { CheckCircle, XCircle, CreditCard, Calendar } from "lucide-react";

const statusVariants: Record<string, { label: string; class: string }> = {
  ACTIVE: { label: "Active", class: "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-800" },
  TRIALING: { label: "Trial", class: "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800" },
  PAST_DUE: { label: "Past Due", class: "bg-yellow-500/10 text-yellow-600 border-yellow-200 dark:border-yellow-800" },
  CANCELED: { label: "Canceled", class: "bg-red-500/10 text-red-600 border-red-200 dark:border-red-800" },
  PAUSED: { label: "Paused", class: "bg-zinc-500/10 text-zinc-600 border-zinc-200 dark:border-zinc-700" },
};

function formatPrice(price: number | null, interval: string | null) {
  if (price === null || price === 0) return "Free";
  const dollars = (price / 100).toFixed(2);
  const map: Record<string, string> = { MONTHLY: "/month", YEARLY: "/year", ONE_TIME: " one-time" };
  return `$${dollars}${interval ? (map[interval] ?? "") : ""}`;
}

export default async function BillingPage() {
  const memberships = await getUserMemberships();
  if (memberships.length === 0) redirect("/onboarding");

  const firstOrg = memberships[0].organization;
  const subscription = firstOrg.subscription;
  const features = subscription ? await getAllFeatureFlags(firstOrg.id) : [];

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Billing</h1>
        <p className="text-muted-foreground mt-1">Your subscription and plan details</p>
      </div>

      {!subscription ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <CreditCard className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
            <p className="font-medium">No active subscription</p>
            <p className="text-sm text-muted-foreground mt-1">
              Contact your administrator to get a plan assigned.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Current plan card */}
          <Card>
            <CardHeader className="flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle>{subscription.plan.name}</CardTitle>
                <CardDescription className="mt-1">
                  {formatPrice(subscription.plan.price, subscription.plan.billingInterval)}
                </CardDescription>
              </div>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusVariants[subscription.status]?.class}`}>
                {statusVariants[subscription.status]?.label ?? subscription.status}
              </span>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  Billing period: {subscription.billingCycleStart.toLocaleDateString()} — {subscription.billingCycleEnd.toLocaleDateString()}
                </span>
              </div>
              {subscription.plan.description && (
                <p className="text-sm text-muted-foreground">{subscription.plan.description}</p>
              )}
            </CardContent>
          </Card>

          {/* Features */}
          {features.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Included Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {features.map((f) => (
                    <div key={f.key} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div>
                        <p className="text-sm font-medium">{f.name}</p>
                        {f.type === "NUMBER" && (
                          <p className="text-xs text-muted-foreground">Limit: {f.value}</p>
                        )}
                      </div>
                      {f.type === "BOOLEAN" ? (
                        f.value === "true"
                          ? <CheckCircle className="h-4 w-4 text-emerald-500" />
                          : <XCircle className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Badge variant="outline" className="font-mono">{f.value}</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
