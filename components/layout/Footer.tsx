import Link from "next/link";
import { ArrowUpRight, Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { clinic, fullAddress, navLinks } from "@/lib/data/clinic";
import { treatments } from "@/lib/data/treatments";
import { Container } from "@/components/ui/Container";
import { EmergencyLink } from "@/components/sections/EmergencyCTA";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-navy-950 pb-24 text-navy-300 md:pb-0">
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-brand-500/10 blur-3xl"
        aria-hidden
      />
      <Container className="relative">
        <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8 lg:py-20">
          <div className="sm:col-span-2 lg:col-span-4">
            <Logo tone="light" />
            <p className="mt-6 max-w-sm text-[0.95rem] leading-relaxed text-navy-300">
              Modern, gentle dentistry in the heart of Indiranagar. Specialist care for every member of your family —
              delivered with honesty, comfort and meticulous hygiene.
            </p>
            <div className="mt-7 flex items-center gap-2 text-sm">
              <span className="flex gap-0.5 text-amber-400" aria-hidden>
                ★★★★★
              </span>
              <span className="text-navy-200">
                <strong className="font-semibold text-white">4.9</strong> from 2,400+ patient ratings
              </span>
            </div>
            <EmergencyLink tone="light" className="mt-6" />
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold tracking-wide text-white">Explore</h3>
            <ul className="mt-5 space-y-3 text-[0.95rem]">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/book" className="transition-colors hover:text-white">
                  Book Appointment
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-sm font-semibold tracking-wide text-white">Treatments</h3>
            <ul className="mt-5 grid grid-cols-1 gap-3 text-[0.95rem]">
              {treatments.slice(0, 7).map((t) => (
                <li key={t.slug}>
                  <Link href={`/treatments#${t.slug}`} className="transition-colors hover:text-white">
                    {t.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/treatments"
                  className="inline-flex items-center gap-1 font-medium text-brand-300 transition-colors hover:text-brand-200"
                >
                  View all <ArrowUpRight className="size-3.5" aria-hidden />
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-sm font-semibold tracking-wide text-white">Visit us</h3>
            <ul className="mt-5 space-y-4 text-[0.95rem]">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-brand-300" aria-hidden />
                <span>{fullAddress}</span>
              </li>
              <li>
                <a href={clinic.phoneHref} className="flex gap-3 transition-colors hover:text-white">
                  <Phone className="mt-0.5 size-4 shrink-0 text-brand-300" aria-hidden />
                  {clinic.phone}
                </a>
              </li>
              <li>
                <a
                  href={clinic.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-3 transition-colors hover:text-white"
                >
                  <MessageCircle className="mt-0.5 size-4 shrink-0 text-brand-300" aria-hidden />
                  WhatsApp us
                </a>
              </li>
              <li>
                <a href={`mailto:${clinic.email}`} className="flex gap-3 transition-colors hover:text-white">
                  <Mail className="mt-0.5 size-4 shrink-0 text-brand-300" aria-hidden />
                  {clinic.email}
                </a>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 size-4 shrink-0 text-brand-300" aria-hidden />
                <span>
                  Mon–Fri {clinic.hours[0].time}
                  <br />
                  Sat {clinic.hours[1].time}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 py-8 text-sm text-navy-400 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} SmileCare Dental Clinic. All rights reserved.</p>
          <p className="text-navy-400/80">
            Demo website — clinic details, doctor profiles and reviews are illustrative sample content.
          </p>
        </div>
      </Container>
    </footer>
  );
}
