import { Star } from "lucide-react";
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

const excerpts = [
  "Eleven months later my teeth are straight and nobody even noticed I was wearing them.",
  "They explained every step, checked on me constantly and finished the root canal in one sitting.",
  "My six-year-old actually asks when his next visit is.",
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
    <figure className="flex h-full flex-col border-t border-navy-100 pt-6">
      <Stars count={review.rating} />
      <blockquote className="mt-4 flex-1 text-base leading-relaxed text-navy-700">“{excerpts[index]}”</blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
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
      </figcaption>
    </figure>
  );
}

export function Testimonials() {
  return (
    <section id="reviews">
      <Container>
        <SectionHeading align="left" size="quiet" eyebrow="Patient reviews" title={<>A few words from <Accent>our patients.</Accent></>} />
        <div className="mt-10 grid gap-8 md:grid-cols-3 lg:gap-12">
          {reviews.slice(0, 3).map((review, i) => (
            <Reveal key={review.name} delay={i * 90}>
              <ReviewCard review={review} index={i} />
            </Reveal>
          ))}
        </div>
        <p className="mt-6 text-xs text-navy-400">Sample testimonials shown for demonstration purposes.</p>
      </Container>
    </section>
  );
}
