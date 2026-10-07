"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { CalendarCheck, Clock, Menu, MessageCircle, Phone, X } from "lucide-react";
import { clinic, navLinks } from "@/lib/data/clinic";
import { cn } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { EmergencyLink } from "@/components/sections/EmergencyCTA";
import { Logo } from "./Logo";
import { DesktopNav } from "./DesktopNav";

function subscribeToScroll(callback: () => void) {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
}

function useScrolled(threshold = 12) {
  return useSyncExternalStore(
    subscribeToScroll,
    () => window.scrollY > threshold,
    () => false,
  );
}

function isActive(pathname: string, href: string) {
  if (href.includes("#")) return false;
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export function Navbar() {
  const pathname = usePathname();
  const scrolled = useScrolled();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  const closeOnNavigation = (event: React.MouseEvent<HTMLElement>) => {
    if (open && event.target instanceof Element && event.target.closest("a")) setOpen(false);
  };

  return (
    <>
      <header
        onClick={closeOnNavigation}
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          scrolled || open
            ? "border-b border-navy-100 bg-white/98 shadow-[0_8px_30px_-12px_rgb(10_31_60/0.12)] lg:bg-white/90 lg:backdrop-blur-xl"
            : "border-b border-transparent bg-white/98 lg:bg-white/70 lg:backdrop-blur-md",
        )}
      >
        <Container
          className={cn("flex items-center justify-between transition-all duration-300", scrolled ? "h-16" : "h-16 lg:h-20")}
        >
          <Logo />

          <DesktopNav pathname={pathname} />

          <div className="flex items-center gap-2">
            <a
              href={clinic.phoneHref}
              className="hidden items-center gap-2.5 rounded-full px-3 py-2 text-sm font-semibold text-navy-800 transition-colors hover:text-brand-600 xl:flex"
            >
              <span className="grid size-9 place-items-center rounded-full bg-mist-100 text-brand-600">
                <Phone className="size-4" aria-hidden />
              </span>
              {clinic.phone}
            </a>
            <span className="hidden sm:block">
              <ButtonLink href="/book" size="sm">
                <CalendarCheck className="size-4" aria-hidden />
                Book Appointment
              </ButtonLink>
            </span>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="grid size-11 place-items-center rounded-full text-navy-900 ring-1 ring-navy-200 transition hover:bg-mist-100 lg:hidden"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </Container>
      </header>

      {/* Mobile menu — rendered outside <header> so backdrop-filter doesn't trap position: fixed */}
      <div
        id="mobile-menu"
        onClick={closeOnNavigation}
        className={cn(
          "fixed inset-x-0 top-16 bottom-0 z-[45] overflow-y-auto bg-white transition-all duration-300 lg:hidden",
          open ? "visible opacity-100" : "invisible -translate-y-2 opacity-0",
        )}
      >
        <Container className="flex min-h-full flex-col gap-8 pt-6 pb-10">
          <nav aria-label="Mobile">
            <ul className="divide-y divide-navy-100">
              {navLinks.map((link, i) => {
                const active = isActive(pathname, link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center justify-between py-4 text-2xl font-semibold tracking-tight transition-colors",
                        active ? "text-brand-600" : "text-navy-900",
                      )}
                      style={{ transitionDelay: open ? `${i * 30}ms` : undefined }}
                    >
                      {link.label}
                      <span className="text-sm font-medium text-navy-300">0{i + 1}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="grid gap-3">
            <ButtonLink href="/book" size="lg" className="w-full">
              <CalendarCheck className="size-5" aria-hidden />
              Book Appointment
            </ButtonLink>
            <div className="grid grid-cols-2 gap-3">
              <ButtonLink href={clinic.phoneHref} variant="secondary" className="w-full">
                <Phone className="size-4" aria-hidden />
                Call
              </ButtonLink>
              <ButtonLink href={clinic.whatsappHref} external variant="whatsapp" className="w-full">
                <MessageCircle className="size-4" aria-hidden />
                WhatsApp
              </ButtonLink>
            </div>
          </div>

          <EmergencyLink className="self-start" />

          <div className="mt-auto rounded-3xl bg-mist-50 p-5 text-sm text-navy-600">
            <p className="flex items-center gap-2 font-semibold text-navy-900">
              <Clock className="size-4 text-brand-600" aria-hidden /> Opening hours
            </p>
            <ul className="mt-3 space-y-1.5">
              {clinic.hours.map((h) => (
                <li key={h.days} className="flex justify-between gap-4">
                  <span>{h.days}</span>
                  <span className="font-medium text-navy-800">{h.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </div>
    </>
  );
}
