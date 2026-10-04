import Link from "next/link";
import { ArrowRight, MessageCircle, Phone, Plus } from "lucide-react";
import { clinic } from "@/lib/data/clinic";
import { faqs } from "@/lib/data/content";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Accent, SectionHeading } from "@/components/ui/SectionHeading";

export function FaqList({ limit }: { limit?: number }) {
  const items = limit ? faqs.slice(0, limit) : faqs;
  return (
    <div className="divide-y divide-navy-100 rounded-3xl bg-white px-6 ring-1 ring-navy-100 sm:px-8">
      {items.map((f, i) => (
        <details key={f.question} className="faq group py-1" open={i === 0}>
          <summary className="flex cursor-pointer items-center justify-between gap-6 py-5 text-left text-[1.05rem] font-semibold tracking-tight text-navy-900 transition-colors hover:text-brand-700">
            {f.question}
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-mist-100 text-navy-700 transition duration-300 group-open:rotate-45 group-open:bg-brand-600 group-open:text-white">
              <Plus className="size-4" aria-hidden />
            </span>
          </summary>
          <p className="pr-12 pb-6 text-[0.97rem] leading-relaxed text-navy-500">{f.answer}</p>
        </details>
      ))}
    </div>
  );
}

export function FAQ() {
  return (
    <section id="faq" className="py-20 sm:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <SectionHeading
                align="left"
                eyebrow="FAQ"
                title={
                  <>
                    Questions? We&apos;ve got <Accent>answers.</Accent>
                  </>
                }
                description="Everything you might want to know before your visit. Can't find what you're looking for? Our team is happy to help."
              />
              <Reveal
                delay={120}
                className="mt-8 rounded-3xl bg-linear-to-br from-brand-50 to-mist-100 p-6 ring-1 ring-brand-100"
              >
                <p className="font-semibold text-navy-900">Still unsure? Talk to a real person.</p>
                <p className="mt-1 text-sm text-navy-500">
                  We usually reply on WhatsApp within 10 minutes during clinic hours.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <ButtonLink href={clinic.phoneHref} size="sm" variant="secondary">
                    <Phone className="size-4 text-brand-600" aria-hidden />
                    Call us
                  </ButtonLink>
                  <ButtonLink href={clinic.whatsappHref} external size="sm" variant="whatsapp">
                    <MessageCircle className="size-4" aria-hidden />
                    WhatsApp
                  </ButtonLink>
                </div>
              </Reveal>
            </div>
          </div>

          <Reveal delay={80} className="lg:col-span-7">
            <FaqList limit={6} />
            <Link
              href="/contact#faq"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-900 transition-colors hover:text-brand-600"
            >
              View all questions
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
