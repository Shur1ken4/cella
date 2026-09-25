"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { copy } from "@/lib/copy";
import { WalletButton } from "@/components/wallet/wallet-button";
import { Logo } from "./logo";

const links = [
  { href: "/how-it-works", label: copy.nav.howItWorks },
  { href: "/app", label: copy.nav.app },
  { href: "/create", label: copy.nav.create },
];

function isActive(pathname: string, href: string) {
  if (href === "/app") return ["/app", "/asset", "/vault", "/sign"].some((p) => pathname.startsWith(p));
  return pathname.startsWith(href);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the mobile menu on navigation / Escape.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync menu to route change
    setOpen(false);
  }, [pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg-deep/85 backdrop-blur-md">
      <a
        href="#main"
        className="sr-only z-50 rounded-md bg-green px-3 py-2 text-bg-deep focus:not-sr-only focus:absolute focus:top-2 focus:left-2"
      >
        {copy.nav.skipToContent}
      </a>
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6">
        <Link href="/" aria-label={copy.nav.home} className="shrink-0 rounded-md focus-ring">
          <Logo className="max-sm:[&>span:last-child]:hidden" />
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={isActive(pathname, l.href) ? "page" : undefined}
                  className={cn(
                    "relative rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150 ease-brand focus-ring",
                    isActive(pathname, l.href) ? "text-text" : "text-text-muted hover:text-text"
                  )}
                >
                  {l.label}
                  {isActive(pathname, l.href) && (
                    <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-green" aria-hidden="true" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <WalletButton />
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? copy.nav.closeMenu : copy.nav.menu}
            className="grid size-10 place-items-center rounded-md border border-border-strong bg-surface-2 text-text md:hidden focus-ring"
          >
            {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Main" className="border-t border-border bg-bg-deep md:hidden">
          <ul className="mx-auto flex max-w-7xl flex-col px-4 py-2">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={isActive(pathname, l.href) ? "page" : undefined}
                  className={cn(
                    "block rounded-md px-3 py-3 text-base font-medium focus-ring",
                    isActive(pathname, l.href) ? "bg-surface-1 text-text" : "text-text-muted"
                  )}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
