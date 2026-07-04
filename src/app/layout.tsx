import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { db } from "@/lib/db";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SaaS Boilerplate",
  description: "Next.js SaaS Boilerplate",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch branding config globally
  let siteConfig = null;
  try {
    siteConfig = await db.siteConfig.findUnique({ where: { id: "global" } });
  } catch (e) {
    // Graceful degradation during build or if DB isn't ready
  }

  const customStyles = {
    ...(siteConfig?.primaryColor ? { "--primary": siteConfig.primaryColor } : {}),
    ...(siteConfig?.secondaryColor ? { "--secondary": siteConfig.secondaryColor } : {}),
  } as React.CSSProperties;

  return (
    <html
      lang="en"
      className={`${outfit.variable} h-full antialiased dark`}
      style={customStyles}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
