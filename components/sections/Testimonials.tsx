import { Quote, Star } from "lucide-react";
import { reviews, type Review } from "@/lib/data/content";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Accent, SectionHeading } from "@/components/ui/SectionHeading";

const avatarTones = [
  "from-brand-400 to-brand-700",
  "from-navy-500 to-navy-800",
  "from-sky-400 to-sky-700",
  "from-teal-400 to-cyan-700",
  "from-indigo-400 to-navy-700",
  "from-brand-300 to-navy-600",
];

function initials(name: string) {
  const words = name
    .replace(/&\s*\S+/, "")
    .split(/\s+/)
    .filter(Boolean);
  return (words[0][0] + (words.length > 1 ? words.at(-1)![0] : "")).toUpperCase();
}

function Stars({ count, className }: { count: number; className?: string }) {
  return (
    <span className={cn("flex gap-0.5", className)} aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn("size-4", i < count ? "fill-amber-400 text-amber-400" : "text-navy-200")}
          aria-hidden
        />
      ))}
    </span>
  );
}

function ReviewCard({ review, index }: { review: Review; index: number }) {
  return (
    <figure className="relative flex flex-col rounded-3xl bg-white p-7 shadow-soft ring-1 ring-navy-100">
      <Quote className="absolute top-6 right-6 size-8 text-brand-100" aria-hidden />
      <Stars count={review.rating} />
      <blockquote className="mt-4 text-[0.98rem] leading-relaxed text-navy-700">“{review.quote}”</blockquote>
      <figcaption className="mt-6 flex items-center gap-3 border-t border-navy-100 pt-5">
        <span
          className={cn(
            "grid size-11 shrink-0 place-items-center rounded-full bg-linear-to-br text-sm font-semibold text-white",
            avatarTones[index % avatarTones.length],
          )}
          aria-hidden
        >
          {initials(review.name)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-semibold text-navy-900">{review.name}</span>
          <span className="block text-sm text-navy-400">{review.detail}</span>
        </span>
        <span className="rounded-full bg-mist-100 px-2.5 py-1 text-xs font-medium whitespace-nowrap text-navy-600">
          {review.treatment}
        </span>
      </figcaption>
    </figure>
  );
}

export function Testimonials() {
  return (
    <section id="reviews" className="py-20 sm:py-28">
      <Container>
        <div className="grid items-end gap-10 lg:grid-cols-12">
          <SectionHeading
            align="left"
            className="lg:col-span-7"
            eyebrow="Patient reviews"
            title={
              <>
                Thousands of smiles, <Accent>one standard</Accent> of care.
              </>
            }
            description="A few words from the families who trust us with their smiles."
          />
          <Reveal delay={100} className="lg:col-span-5 lg:justify-self-end">
            <div className="flex items-center gap-5 rounded-3xl bg-mist-50 p-5 pr-7 ring-1 ring-mist-200">
              <span className="text-5xl font-semibold tracking-tight text-navy-900">4.9</span>
              <span>
                <Stars count={5} />
                <span className="mt-1.5 block text-sm text-navy-500">Average from 2,400+ patient ratings</span>
              </span>
            </div>
          </Reveal>
        </div>

        <div className="mt-12 columns-1 gap-5 md:columns-2 lg:columns-3 [&>*]:mb-5 [&>*]:break-inside-avoid">
          {reviews.map((r, i) => (
            <Reveal key={r.name} delay={(i % 3) * 90}>
              <ReviewCard review={r} index={i} />
            </Reveal>
          ))}
        </div>

        <p className="mt-4 text-center text-xs text-navy-400">Sample testimonials shown for demonstration purposes.</p>
      </Container>
    </section>
  );
}
