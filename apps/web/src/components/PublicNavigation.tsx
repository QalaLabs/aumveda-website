"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

/** Quiet hospitality nav — few links, one accent action → portal /step-1. */
const NAV = [
  { label: "About", path: "/about" },
  { label: "Services", path: "/services" },
  { label: "Shop", path: "/shop" },
  { label: "Programmes", path: "/programs" },
  { label: "Insights", path: "/insights" },
  { label: "Contact", path: "/contact" },
];

const PublicNavigation = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Home is night-ink marketing — keep light type until scrolled. */
  const overDark = isHome && !scrolled;
  const ink = overDark ? "text-[hsl(var(--av-parchment))]" : "text-[hsl(var(--av-night))]";
  const mute = overDark
    ? "text-[hsl(var(--av-parchment)/0.7)] hover:text-[hsl(var(--av-gold-soft))]"
    : "text-[hsl(var(--av-mute))] hover:text-[hsl(var(--av-night))]";
  const homeScrolledInk = isHome && scrolled;

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-[background-color,backdrop-filter] duration-300",
        scrolled
          ? isHome
            ? "bg-[hsl(var(--av-ink)/0.85)] backdrop-blur-md border-b border-[hsl(var(--av-parchment)/0.1)]"
            : "bg-[hsl(var(--av-parchment)/0.92)] backdrop-blur-md border-b border-[hsl(var(--av-stone))]"
          : "bg-transparent"
      )}
    >
      <div className="max-w-[1120px] mx-auto px-6 h-16 md:h-20 flex items-center justify-between">
        <Link
          href="/"
          className={cn("flex items-center gap-3", homeScrolledInk ? "text-[hsl(var(--av-parchment))]" : ink)}
          aria-label="AUMVEDA home"
        >
          <Image
            src="/logo.png"
            alt=""
            width={36}
            height={36}
            className="object-contain w-9 h-9"
          />
          <span className="font-serif text-lg md:text-xl tracking-tight">AUMVEDA</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {NAV.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "font-body text-[13px] tracking-[0.04em] transition-colors",
                homeScrolledInk
                  ? pathname === item.path
                    ? "text-[hsl(var(--av-parchment))]"
                    : "text-[hsl(var(--av-parchment)/0.65)] hover:text-[hsl(var(--av-gold-soft))]"
                  : pathname === item.path
                    ? ink
                    : mute
              )}
            >
              {item.label}
            </Link>
          ))}

          {/* Interconnected Portal Links */}
          <div className="flex items-center gap-3 pl-2 border-l border-[hsl(var(--av-stone)/0.4)]">
            <Link
              href="/auth/login?portal=client"
              className={cn(
                "font-body text-[12px] tracking-[0.02em] font-medium transition-colors",
                homeScrolledInk
                  ? "text-[hsl(var(--av-parchment)/0.8)] hover:text-[hsl(var(--av-gold-soft))]"
                  : "text-[hsl(var(--av-mute))] hover:text-[hsl(var(--av-night))]"
              )}
            >
              Client Login
            </Link>
            <span className={cn("text-xs opacity-30", homeScrolledInk ? "text-[hsl(var(--av-parchment))]" : "text-[hsl(var(--av-mute))]")}>·</span>
            <Link
              href="/auth/login?portal=coach"
              className={cn(
                "font-body text-[12px] tracking-[0.02em] font-medium transition-colors",
                homeScrolledInk
                  ? "text-[hsl(var(--av-parchment)/0.8)] hover:text-[hsl(var(--av-gold-soft))]"
                  : "text-[hsl(var(--av-mute))] hover:text-[hsl(var(--av-night))]"
              )}
            >
              Coach Login
            </Link>
          </div>

          <Link
            href="/step-1"
            className={cn(
              "inline-flex h-10 items-center px-5 font-body text-sm font-medium transition-transform active:scale-[0.97]",
              isHome
                ? "rounded-none border border-[hsl(var(--av-parchment)/0.22)] text-[hsl(var(--av-parchment))] uppercase tracking-[0.2em] text-[11px] hover:border-[hsl(var(--av-gold))] hover:bg-[hsl(var(--av-gold))] hover:text-[hsl(var(--av-ink))]"
                : "rounded-full bg-[hsl(var(--av-gold))] text-[hsl(var(--av-ink))]"
            )}
          >
            Begin
          </Link>
        </div>

        <button
          type="button"
          className={cn("md:hidden p-2", homeScrolledInk ? "text-[hsl(var(--av-parchment))]" : ink)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div
          className={cn(
            "md:hidden border-t px-6 py-6 flex flex-col gap-4",
            isHome
              ? "border-[hsl(var(--av-parchment)/0.1)] bg-[hsl(var(--av-ink))]"
              : "border-[hsl(var(--av-stone))] bg-[hsl(var(--av-parchment))]"
          )}
        >
          {NAV.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setOpen(false)}
              className={cn(
                "font-body text-base py-2",
                isHome ? "text-[hsl(var(--av-parchment))]" : "text-[hsl(var(--av-night))]"
              )}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/step-1"
            onClick={() => setOpen(false)}
            className={cn(
              "inline-flex h-12 items-center justify-center font-body font-medium",
              isHome
                ? "border border-[hsl(var(--av-gold)/0.6)] bg-[hsl(var(--av-gold)/0.1)] text-[hsl(var(--av-parchment))] uppercase tracking-[0.24em] text-[12px]"
                : "rounded-full bg-[hsl(var(--av-night))] text-[hsl(var(--av-gold-soft))]"
            )}
          >
            Begin Your Journey
          </Link>

          <div className="pt-3 mt-1 border-t border-[hsl(var(--av-stone)/0.3)] flex flex-col gap-2">
            <Link
              href="/auth/login?portal=client"
              onClick={() => setOpen(false)}
              className={cn(
                "font-body text-sm py-2 px-3 rounded-xl flex items-center justify-between transition-colors",
                isHome
                  ? "text-[hsl(var(--av-parchment)/0.8)] bg-white/5 hover:bg-white/10"
                  : "text-[hsl(var(--av-night))] bg-[hsl(var(--av-stone)/0.3)] hover:bg-[hsl(var(--av-stone)/0.5)]"
              )}
            >
              <span>Client Sanctuary Login</span>
              <span className="text-xs text-[hsl(var(--av-gold))]">→</span>
            </Link>
            <Link
              href="/auth/login?portal=coach"
              onClick={() => setOpen(false)}
              className={cn(
                "font-body text-sm py-2 px-3 rounded-xl flex items-center justify-between transition-colors",
                isHome
                  ? "text-[hsl(var(--av-parchment)/0.8)] bg-white/5 hover:bg-white/10"
                  : "text-[hsl(var(--av-night))] bg-[hsl(var(--av-stone)/0.3)] hover:bg-[hsl(var(--av-stone)/0.5)]"
              )}
            >
              <span>Coach & Practitioner Login</span>
              <span className="text-xs text-[hsl(var(--av-gold))]">→</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default PublicNavigation;
