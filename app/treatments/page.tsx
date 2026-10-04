import type { Metadata } from "next";
import { BadgeCheck, ClipboardList, MessagesSquare, ScanLine, Smile } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { Accent, SectionHeading } from "@/components/ui/SectionHeading";
import { TreatmentsExplorer } from "@/components/treatments/TreatmentsExplorer";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { EmergencyBanner } from "@/components/sections/EmergencyCTA";

export const metadata: Metadata = {
  title: "Treatments & Pricing",
  description:
    "Dental check-ups, cleaning, root canals, implants, braces and aligners, whitening, crowns, extractions, kids dentistry and smile makeovers — with transparent starting prices.",
};

const steps = [
  {
    icon: MessagesSquare,
    title: "Consultation",
    text: "Tell us what's bothering you or what you'd like to change. No rush, no pressure.",
  },
  {
    icon: ScanLine,
    title: "Digital diagnosis",
    text: "Intraoral camera and digital X-rays let you see exactly what we see, on screen.",
  },
  {
    icon: ClipboardList,
    title: "Clear written plan",
    text: "Options, timelines and costs in writing — so you can decide with confidence.",
  },
  {
    icon: Smile,
    title: "Comfortable treatment",
    text: "Gentle, pain-aware care with follow-ups until you're completely happy.",
  },
];

export default function TreatmentsPage() {
  return (
    <>
      <PageHeader
        breadcrumb="Treatments"
        eyebrow="Treatments & pricing"
        title={
          <>
            Every treatment your smile needs, <Accent>clearly priced.</Accent>
          </>
        }
        description="From preventive care to complete smile makeovers, each treatment is led by a specialist and planned with modern digital tools. Starting prices are listed upfront."
      >
        <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-soft ring-1 ring-navy-100">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-2xl bg-brand-50 text-brand-600">
              <BadgeCheck className="size-5" aria-hidden />
            </span>
            <p className="font-semibold text-navy-900">Our pricing promise</p>
          </div>
          <ul className="mt-4 space-y-2 text-sm text-navy-500">
            <li>• Written estimate before any treatment</li>
            <li>• No hidden charges or surprise add-ons</li>
            <li>• No-cost EMI on plans above ₹10,000</li>
          </ul>
        </div>
      </PageHeader>

      <section className="pt-4 pb-10 sm:pb-14">
        <Container>
          <TreatmentsExplorer />
        </Container>
      </section>

      <EmergencyBanner className="pb-20 sm:pb-24" />

      <section className="px-2 sm:px-4">
        <div className="rounded-[2.5rem] bg-mist-50 py-20 ring-1 ring-mist-100 sm:py-24">
          <Container>
            <SectionHeading
              eyebrow="Your visit"
              title={
                <>
                  What to expect, <Accent>step by step.</Accent>
                </>
              }
              description="Every treatment at SmileCare follows the same calm, transparent process."
            />
            <ol className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map(({ icon: Icon, title, text }, i) => (
                <li key={title}>
                  <Reveal delay={i * 90} className="relative h-full rounded-3xl bg-white p-7 ring-1 ring-navy-100">
                    <span className="absolute top-6 right-7 text-5xl font-semibold tracking-tight text-mist-200">
                      0{i + 1}
                    </span>
                    <span className="grid size-12 place-items-center rounded-2xl bg-navy-900 text-white">
                      <Icon className="size-5" strokeWidth={1.75} aria-hidden />
                    </span>
                    <h3 className="mt-6 text-lg font-semibold tracking-tight">{title}</h3>
                    <p className="mt-2 text-[0.95rem] leading-relaxed text-navy-500">{text}</p>
                  </Reveal>
                </li>
              ))}
            </ol>
          </Container>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
