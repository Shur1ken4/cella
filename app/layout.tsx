import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { copy } from "@/lib/copy";

// Fonts (Space Grotesk / IBM Plex Sans / JetBrains Mono) are added in Phase 1.

export const metadata: Metadata = {
  title: copy.site.name,
  description: copy.site.pitch,
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
