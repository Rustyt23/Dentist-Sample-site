import { transformations } from "@/lib/data/content";
import { getDoctor } from "@/lib/data/doctors";
import { unsplash } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Accent, SectionHeading } from "@/components/ui/SectionHeading";
import { TransformationComparison, type TransformationComparisonItem } from "./TransformationComparison";

export function SmileTransformations() {
  const items: TransformationComparisonItem[] = transformations.map((transformation) => ({
    title: transformation.title,
    treatment: transformation.treatment,
    duration: transformation.duration,
    concern: transformation.concern,
    src: unsplash(transformation.image, 1600, transformation.cropHeight ? { height: transformation.cropHeight } : undefined),
    alt: transformation.alt,
    beforeFilter: transformation.beforeFilter,
    doctorName: getDoctor(transformation.doctor)?.name,
  }));

  return (
    <section id="results" className="px-2 sm:px-4">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-navy-950 py-16 sm:py-20 lg:py-24">
        <div className="pointer-events-none absolute -top-40 -right-20 size-[30rem] rounded-full bg-brand-500/15 blur-3xl" aria-hidden />
        <Container className="relative max-w-6xl">
          <SectionHeading tone="light" eyebrow="Smile transformations" title={<>Real change you can <Accent tone="light">see.</Accent></>} description="One smile at a time. Slide to explore the difference." />
          <Reveal className="mt-10">
            <TransformationComparison items={items} />
          </Reveal>
        </Container>
      </div>
    </section>
  );
}
