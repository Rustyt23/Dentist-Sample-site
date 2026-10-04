import type { Metadata } from "next";
import { Leaf, ShieldCheck, Sofa } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { Accent } from "@/components/ui/SectionHeading";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { FinalCTA } from "@/components/sections/FinalCTA";

export const metadata: Metadata = {
  title: "Clinic Gallery",
  description:
    "Take a look inside SmileCare — a calm reception lounge, light-filled treatment suites and modern digital dental equipment.",
};

const features = [
  {
    icon: Sofa,
    title: "Calm, hotel-style lounge",
    text: "Soft seating, filtered water and zero waiting-room clutter.",
  },
  {
    icon: Leaf,
    title: "Light-filled suites",
    text: "Every treatment room has natural light and ceiling-mounted entertainment.",
  },
  {
    icon: ShieldCheck,
    title: "Dedicated sterilisation zone",
    text: "A separate, glass-walled area you're welcome to see for yourself.",
  },
];

export default function GalleryPage() {
  return (
    <>
      <PageHeader
        breadcrumb="Gallery"
        eyebrow="Clinic gallery"
        title={
          <>
            Step inside a clinic that feels <Accent>like a calm retreat.</Accent>
          </>
        }
        description="We designed SmileCare to feel nothing like a hospital — warm materials, natural light and spotless, modern treatment suites."
      />

      <section className="pt-2 pb-20 sm:pb-24">
        <Container>
          <GalleryGrid />
        </Container>
      </section>

      <section className="pb-4">
        <Container>
          <div className="grid gap-5 md:grid-cols-3">
            {features.map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 90} className="flex gap-5 rounded-3xl bg-mist-50 p-7 ring-1 ring-mist-100">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white text-brand-600 shadow-soft ring-1 ring-navy-100">
                  <Icon className="size-5" strokeWidth={1.75} aria-hidden />
                </span>
                <span>
                  <span className="block font-semibold tracking-tight text-navy-900">{title}</span>
                  <span className="mt-1 block text-[0.95rem] leading-relaxed text-navy-500">{text}</span>
                </span>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <FinalCTA />
    </>
  );
}
