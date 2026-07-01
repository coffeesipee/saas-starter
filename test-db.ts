import { db } from "./src/lib/db";

async function main() {
  try {
    const user = await db.user.findUnique({
      where: { email: "admin@example.com" },
    });
    console.log("SUCCESS:", user?.email);
  } catch (err) {
    console.error("ERROR:", err);
  }
}
main();
