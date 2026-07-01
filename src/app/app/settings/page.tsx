import { auth } from "@/lib/auth";
import { SettingsPage } from "./settings-forms";

export default async function AccountSettingsPage() {
  const session = await auth();
  return <SettingsPage defaultName={session?.user?.name ?? ""} />;
}
