import type { Metadata } from "next";
import { ArrowRight, CalendarCheck, Mail, MessageCircle, Phone } from "lucide-react";
import { clinic } from "@/lib/data/clinic";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { Accent, SectionHeading } from "@/components/ui/SectionHeading";
import { ClinicDetails } from "@/components/sections/VisitClinic";
import { MapPlaceholder } from "@/components/sections/MapPlaceholder";
import { FaqList } from "@/components/sections/FAQ";
import { EmergencyBanner } from "@/components/sections/EmergencyCTA";

export const metadata: Metadata = {
  title: "Contact & Directions",
  description:
    "Call, WhatsApp or visit SmileCare Dental Clinic on 100 Feet Road, Indiranagar, Bengaluru. Opening hours, directions and emergency contact.",
};

const channels = [
  {
    icon: Phone,
    title: "Call the clinic",
    text: "Speak to our front desk for appointments and questions.",
    value: clinic.phone,
    href: clinic.phoneHref,
    cta: "Call now",
    external: false,
  },
  {
    icon: MessageCircle,
    title: "WhatsApp us",
    text: "Quick replies within 10 minutes during clinic hours.",
    value: clinic.whatsapp,
    href: clinic.whatsappHref,
    cta: "Start chat",
    external: true,
  },
  {
    icon: Mail,
    title: "Email",
    text: "For reports, insurance paperwork and general enquiries.",
    value: clinic.email,
    href: `mailto:${clinic.email}`,
    cta: "Send email",
    external: false,
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        breadcrumb="Contact"
        eyebrow="Contact us"
        title={
          <>
            We&apos;re here to help, <Accent>six days a week.</Accent>
          </>
        }
        description="Call, message or drop by — our friendly front-desk team will help you find the right time and the right dentist."
      >
        <ButtonLink href="/book" size="lg">
          <CalendarCheck className="size-5" aria-hidden />
          Book Appointment
        </ButtonLink>
      </PageHeader>

      <section className="pt-2 pb-10">
        <Container>
          <div className="grid gap-5 md:grid-cols-3">
            {channels.map(({ icon: Icon, title, text, value, href, cta, external }, i) => (
              <Reveal key={title} delay={i * 90}>
                <a
                  href={href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group flex h-full flex-col rounded-3xl bg-white p-7 ring-1 ring-navy-100 transition duration-300 hover:-translate-y-1 hover:shadow-lift hover:ring-brand-200"
                >
                  <span className="grid size-12 place-items-center rounded-2xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                    <Icon className="size-5" strokeWidth={1.75} aria-hidden />
                  </span>
                  <span className="mt-6 text-lg font-semibold tracking-tight text-navy-900">{title}</span>
                  <span className="mt-1 text-[0.95rem] text-navy-500">{text}</span>
                  <span className="mt-5 font-semibold break-all text-navy-900">{value}</span>
                  <span className="mt-auto flex items-center gap-1.5 pt-6 text-sm font-semibold text-brand-600">
                    {cta}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <EmergencyBanner className="pt-0 pb-16" />

      <section className="px-2 sm:px-4">
        <div className="rounded-[2.5rem] bg-mist-50 py-20 ring-1 ring-mist-100 sm:py-24">
          <Container>
            <SectionHeading
              eyebrow="Find us"
              title={
                <>
                  Visit SmileCare in <Accent>Indiranagar.</Accent>
                </>
              }
              description={clinic.landmark}
            />
            <div className="mt-12 grid gap-5 lg:grid-cols-5">
              <Reveal className="lg:col-span-2">
                <ClinicDetails />
              </Reveal>
              <Reveal delay={120} className="lg:col-span-3">
                <MapPlaceholder className="h-[22rem] sm:h-[28rem] lg:h-full lg:min-h-[32rem]" />
              </Reveal>
            </div>
          </Container>
        </div>
      </section>

      <section id="faq" className="py-20 sm:py-28">
        <Container className="max-w-4xl">
          <SectionHeading
            eyebrow="Before you visit"
            title={
              <>
                Common <Accent>questions</Accent>
              </>
            }
          />
          <Reveal className="mt-12">
            <FaqList />
          </Reveal>
        </Container>
      </section>
    </>
  );
}
