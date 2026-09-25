import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { copy } from "@/lib/copy";
import { fontVariables } from "./fonts";

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
    <html lang="en" className={`dark ${fontVariables}`} suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
