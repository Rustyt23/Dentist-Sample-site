"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarCheck, MessageCircle, Navigation, Phone } from "lucide-react";
import { clinic } from "@/lib/data/clinic";

const itemClass =
  "flex flex-col items-center justify-center gap-1 rounded-2xl py-2 text-[0.7rem] font-semibold text-navy-700 transition active:scale-95 active:bg-mist-100";

/** Thumb-friendly quick actions pinned to the bottom of small screens. */
export function MobileActionBar() {
  const pathname = usePathname();
  // The booking flow has its own sticky Back/Continue bar.
  if (pathname === "/book") return null;

  return (
    <nav
      aria-label="Quick actions"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-navy-100 bg-white/98 px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-12px_30px_-12px_rgb(10_31_60/0.18)] md:hidden"
    >
      <div className="grid grid-cols-[1.35fr_1fr_1fr_1fr] gap-1.5">
        <Link
          href="/book"
          className="flex flex-col items-center justify-center gap-1 rounded-2xl bg-brand-600 py-2 text-[0.7rem] font-semibold text-white shadow-glow transition active:scale-95"
        >
          <CalendarCheck className="size-5" aria-hidden />
          Book
        </Link>
        <a href={clinic.whatsappHref} target="_blank" rel="noopener noreferrer" className={itemClass}>
          <MessageCircle className="size-5 text-[#1fa855]" aria-hidden />
          WhatsApp
        </a>
        <a href={clinic.phoneHref} className={itemClass}>
          <Phone className="size-5 text-brand-600" aria-hidden />
          Call
        </a>
        <a href={clinic.directionsHref} target="_blank" rel="noopener noreferrer" className={itemClass}>
          <Navigation className="size-5 text-navy-600" aria-hidden />
          Directions
        </a>
      </div>
    </nav>
  );
}
