import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { faqs, type Faq } from "@/lib/data/content";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Accent, SectionHeading } from "@/components/ui/SectionHeading";
import { EmergencyBanner } from "./EmergencyCTA";

const homepageFaqs: Faq[] = [
  { question: "Will treatment hurt?", answer: "We use gentle techniques and local anaesthesia to keep you comfortable. Tell us if you're anxious — we'll go at your pace, and you can pause at any time." },
  faqs.find((faq) => faq.question === "How do I book?")!,
  { question: "Do you handle dental emergencies?", answer: "Yes. We keep same-day slots for severe toothache, swelling and broken or knocked-out teeth. Call our emergency number so we can arrange care as quickly as possible." },
];

export function FaqList({ limit, items, quiet = false }: { limit?: number; items?: Faq[]; quiet?: boolean }) {
  const questions = items ?? (limit ? faqs.slice(0, limit) : faqs);
  return (
    <div className={cn("divide-y divide-navy-100", quiet ? "border-y border-navy-100" : "rounded-3xl bg-white px-6 ring-1 ring-navy-100 sm:px-8")}>
      {questions.map((faq, i) => (
        <details key={faq.question} className="faq group py-1" open={i === 0}>
          <summary className={cn("flex cursor-pointer items-center justify-between gap-6 py-5 text-left font-semibold tracking-tight text-navy-900 transition-colors hover:text-brand-700", quiet ? "text-base" : "text-[1.05rem]")}>
            {faq.question}
            <span className={cn("grid shrink-0 place-items-center transition duration-300 group-open:rotate-45", quiet ? "text-brand-600" : "size-9 rounded-full bg-mist-100 text-navy-700 group-open:bg-brand-600 group-open:text-white")}>
              <Plus className="size-4" aria-hidden />
            </span>
          </summary>
          <p className={cn("pb-6 leading-relaxed text-navy-500", quiet ? "pr-8 text-sm" : "pr-12 text-[0.97rem]")}>{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}

export function FAQ() {
  return (
    <section id="faq">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <SectionHeading align="left" size="quiet" className="lg:col-span-5" eyebrow="Before your visit" title={<>Feel informed. <Accent>Feel comfortable.</Accent></>} />
          <Reveal delay={80} className="lg:col-span-7">
            <FaqList items={homepageFaqs} quiet />
            <Link href="/contact#faq" className="mt-5 inline-flex items-center gap-2 py-1 text-sm font-semibold text-brand-700 transition-colors hover:text-navy-900">
              View All Questions <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Reveal>
        </div>
      </Container>
      <EmergencyBanner compact className="mt-10" />
    </section>
  );
}
