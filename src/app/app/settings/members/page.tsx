import { getUserMemberships } from "@/lib/memberships";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MembersClient } from "./members-client";
import { auth } from "@/lib/auth";

export default async function MembersPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const memberships = await getUserMemberships();
  if (memberships.length === 0) redirect("/onboarding");

  const firstOrg = memberships[0];
  const isOwnerOrAdmin = ["OWNER", "ADMIN"].includes(firstOrg.role);

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Members</h1>
        <p className="text-muted-foreground mt-1">{firstOrg.organization.name}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>Manage who has access to {firstOrg.organization.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <MembersClient
            orgId={firstOrg.organizationId}
            currentUserId={session.user.id}
            currentUserRole={firstOrg.role}
            isOwnerOrAdmin={isOwnerOrAdmin}
          />
        </CardContent>
      </Card>
    </div>
  );
}
