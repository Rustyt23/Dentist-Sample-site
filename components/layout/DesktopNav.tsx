"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { navLinks } from "@/lib/data/clinic";
import { cn } from "@/lib/utils";
import styles from "./DesktopNav.module.css";

function positionPill(nav: HTMLElement, link: HTMLElement | null) {
  const pill = nav.querySelector<HTMLElement>(`[data-nav-pill]`);
  if (!pill) return;
  pill.style.opacity = link ? "1" : "0";
  if (!link) return;
  pill.style.width = `${link.offsetWidth}px`;
  pill.style.height = `${link.offsetHeight}px`;
  pill.style.transform = `translate(${link.offsetLeft}px, ${link.offsetTop}px)`;
}

function restorePill(nav: HTMLElement) {
  const focused = document.activeElement;
  const target = focused instanceof HTMLAnchorElement && nav.contains(focused)
    ? focused
    : nav.querySelector<HTMLElement>('[aria-current="page"]');
  positionPill(nav, target);
}

export function DesktopNav({ pathname }: { pathname: string }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const nav = ref.current;
    if (!nav) return;
    let disposed = false;
    const update = () => {
      if (disposed) return;
      restorePill(nav);
      nav.dataset.ready = "true";
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(nav);
    void document.fonts.ready.then(update);
    return () => {
      disposed = true;
      observer.disconnect();
    };
  }, [pathname]);

  return (
    <nav
      ref={ref}
      aria-label="Main"
      className={cn("hidden lg:block", styles.nav)}
      onPointerLeave={(event) => restorePill(event.currentTarget)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          positionPill(event.currentTarget, event.currentTarget.querySelector('[aria-current="page"]'));
        }
      }}
    >
      <span data-nav-pill className={styles.pill} aria-hidden />
      <ul className="relative flex items-center gap-1">
        {navLinks.map((link) => {
          const active = !link.href.includes("#") && (link.href === "/" ? pathname === "/" : pathname.startsWith(link.href));
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={styles.link}
                onPointerEnter={(event) => {
                  if (event.pointerType === "mouse" && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
                    positionPill(ref.current!, event.currentTarget);
                  }
                }}
                onFocus={(event) => positionPill(ref.current!, event.currentTarget)}
              >
                <span>{link.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
