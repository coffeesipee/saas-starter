import { auth } from "@/lib/auth";
import { getUserMemberships } from "@/lib/memberships";
import { requireOrgRole } from "@/lib/memberships";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { OrgSettingsForm } from "./org-settings-form";
import { redirect } from "next/navigation";

export default async function OrganizationSettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const memberships = await getUserMemberships();
  if (memberships.length === 0) redirect("/app/onboarding");
  const orgId = memberships[0].organizationId;

  const firstOrg = memberships[0].organization;

  // Only OWNER or ADMIN can manage org settings
  const membership = await requireOrgRole(firstOrg.id, ["OWNER", "ADMIN"]);

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Organization Settings</h1>
        <p className="text-muted-foreground mt-1">{firstOrg.name}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General</CardTitle>
          <CardDescription>Update your organization name and description</CardDescription>
        </CardHeader>
        <CardContent>
          <OrgSettingsForm org={{ id: firstOrg.id, name: firstOrg.name, description: firstOrg.description }} />
        </CardContent>
      </Card>
    </div>
  );
}
