import { Clock, MapPin, MessageCircle, Navigation, Phone } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { clinic } from "@/lib/data/clinic";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Accent, SectionHeading } from "@/components/ui/SectionHeading";
import { MapPlaceholder } from "./MapPlaceholder";

export function ClinicDetails({ compact = false }: { compact?: boolean }) {
  return (
    <div className={cn("flex h-full flex-col", compact ? "py-2" : "rounded-[2rem] bg-white p-7 shadow-soft ring-1 ring-navy-100 sm:p-9")}>
      <ul className="space-y-7">
        <li className="flex gap-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-600">
            <MapPin className="size-5" aria-hidden />
          </span>
          <div>
            <p className="text-sm font-medium text-navy-400">Address</p>
            <p className="mt-1 font-semibold text-navy-900">
              {clinic.address.line1}, {clinic.address.line2}
            </p>
            <p className="text-navy-600">
              {clinic.address.city}, {clinic.address.region} {clinic.address.postalCode}
            </p>
            <p className="mt-1.5 text-sm text-navy-400">{clinic.landmark}</p>
          </div>
        </li>
        <li className="flex gap-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-600">
            <Phone className="size-5" aria-hidden />
          </span>
          <div>
            <p className="text-sm font-medium text-navy-400">Phone & WhatsApp</p>
            <a href={clinic.phoneHref} className="mt-1 block font-semibold text-navy-900 hover:text-brand-600">
              {clinic.phone}
            </a>
            <p className="text-sm text-navy-500">
              Emergencies:{" "}
              <a href={clinic.emergencyPhoneHref} className="font-medium text-navy-700 hover:text-brand-600">
                {clinic.emergencyPhone}
              </a>
            </p>
          </div>
        </li>
        <li className="flex gap-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-600">
            <Clock className="size-5" aria-hidden />
          </span>
          <div className="flex-1">
            <p className="text-sm font-medium text-navy-400">Opening hours</p>
            <dl className="mt-2 space-y-1.5 text-sm sm:text-[0.95rem]">
              {clinic.hours.map((h) => (
                <div key={h.days} className="flex flex-wrap justify-between gap-x-3">
                  <dt className="whitespace-nowrap text-navy-600">{h.days}</dt>
                  <dd className="whitespace-nowrap font-semibold text-navy-900">{h.time}</dd>
                </div>
              ))}
            </dl>
          </div>
        </li>
      </ul>

      {compact ? (
        <div className="mt-auto flex flex-wrap items-center gap-6 pt-8">
          <ButtonLink href="/book">Book Appointment</ButtonLink>
          <a href={clinic.whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 py-2 text-sm font-semibold text-brand-700 hover:text-navy-900">
            <MessageCircle className="size-4" aria-hidden />WhatsApp
          </a>
        </div>
      ) : (
      <div className="mt-auto grid gap-3 pt-9 sm:grid-cols-3">
        <ButtonLink href={clinic.phoneHref} size="sm" className="w-full">
          <Phone className="size-4" aria-hidden />
          Call
        </ButtonLink>
        <ButtonLink href={clinic.whatsappHref} external size="sm" variant="whatsapp" className="w-full">
          <MessageCircle className="size-4" aria-hidden />
          WhatsApp
        </ButtonLink>
        <ButtonLink href={clinic.directionsHref} external size="sm" variant="secondary" className="w-full">
          <Navigation className="size-4 text-brand-600" aria-hidden />
          Directions
        </ButtonLink>
      </div>
      )}
    </div>
  );
}

export function VisitClinic() {
  return (
    <section id="visit">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading align="left" size="quiet" eyebrow="Visit SmileCare" title={<>Your next smile starts <Accent>here.</Accent></>} description="Find us in Indiranagar, with free parking for patients." />
          <Link href={clinic.directionsHref} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center gap-2 py-2 text-sm font-semibold text-brand-700 hover:text-navy-900">
            <Navigation className="size-4" aria-hidden />Get Directions
          </Link>
        </div>
        <div className="mt-10 grid gap-10 lg:grid-cols-5 lg:gap-16">
          <Reveal className="lg:col-span-2"><ClinicDetails compact /></Reveal>
          <Reveal delay={120} className="lg:col-span-3">
            <MapPlaceholder className="h-[22rem] sm:h-[26rem] lg:h-full lg:min-h-[28rem]" />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
