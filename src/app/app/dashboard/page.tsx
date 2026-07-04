import { auth } from "@/lib/auth";
import { getUserMemberships } from "@/lib/memberships";
import { getAllFeatureFlags } from "@/lib/features";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { redirect } from "next/navigation";
import { Building2, CreditCard, CheckCircle, XCircle } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  const memberships = await getUserMemberships();

  // Redirect to onboarding if no org
  if (memberships.length === 0) {
    redirect("/app/onboarding");
  }

  const firstOrg = memberships[0].organization;
  const features = await getAllFeatureFlags(firstOrg.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, {session?.user?.name ?? "User"}
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Organization</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{firstOrg.name}</p>
            <p className="text-xs text-muted-foreground">/{firstOrg.slug}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Subscription</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {firstOrg.subscription ? (
              <>
                <p className="text-lg font-semibold">{firstOrg.subscription.plan.name}</p>
                <Badge
                  variant={firstOrg.subscription.status === "ACTIVE" ? "default" : "secondary"}
                  className="mt-1 text-xs"
                >
                  {firstOrg.subscription.status}
                </Badge>
              </>
            ) : (
              <>
                <p className="text-lg font-semibold text-muted-foreground">No plan</p>
                <p className="text-xs text-muted-foreground mt-1">Contact support to upgrade</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Your Role</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="outline" className="text-sm font-medium">
              {memberships[0].role}
            </Badge>
            <p className="text-xs text-muted-foreground mt-2">in {firstOrg.name}</p>
          </CardContent>
        </Card>
      </div>

      {/* Feature flags */}
      {features.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Plan Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2">
              {features.map((f) => (
                <div
                  key={f.key}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border"
                >
                  <div>
                    <p className="text-sm font-medium">{f.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{f.key}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {f.type === "BOOLEAN" ? (
                      f.value === "true" ? (
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-muted-foreground" />
                      )
                    ) : (
                      <Badge variant="outline">{f.value}</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}