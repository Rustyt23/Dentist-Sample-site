import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getTreatment } from "@/lib/data/treatments";
import { TreatmentCard } from "@/components/treatments/TreatmentCard";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Accent, SectionHeading } from "@/components/ui/SectionHeading";

const popular = ["dental-checkup", "root-canal", "dental-implants", "braces-aligners", "teeth-whitening", "kids-dentistry"];

export function PopularTreatments() {
  return (
    <section id="treatments">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading align="left" size="quiet" eyebrow="Popular treatments" title={<>Care for <Accent>every smile.</Accent></>} />
          <Link href="/treatments" className="inline-flex shrink-0 items-center gap-2 py-2 text-sm font-semibold text-brand-700 transition-colors hover:text-navy-900">
            View All Treatments <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {popular.map((slug, i) => {
            const treatment = getTreatment(slug);
            if (!treatment) return null;
            return (
              <Reveal key={slug} delay={(i % 3) * 70} scale>
                <TreatmentCard treatment={{ slug, name: treatment.name, summary: treatment.summary, icon: treatment.icon }} />
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
