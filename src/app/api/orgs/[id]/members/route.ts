import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: orgId } = await params;

  // Verify user is a member of this org
  const membership = await db.membership.findUnique({
    where: { userId_organizationId: { userId: session.user.id, organizationId: orgId } },
  });
  if (!membership) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const members = await db.membership.findMany({
    where: { organizationId: orgId },
    include: { user: { select: { id: true, name: true, email: true } } },
  });

  return NextResponse.json(members);
}
