import { Star } from "lucide-react";
import { Container } from "@/components/ui/Container";

const assurances = ["Experienced Dentists", "Modern Equipment", "Hygienic Care"];

export function TrustSection() {
  return (
    <section aria-label="Why patients trust SmileCare">
      <Container>
        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 border-y border-navy-100 py-5 text-xs font-medium text-navy-600 sm:gap-x-8 sm:text-sm">
          <li className="flex items-center gap-2">
            <Star className="size-4 fill-brand-600 text-brand-600" aria-hidden />
            <span className="font-semibold text-navy-900">4.9 Rating</span>
          </li>
          {assurances.map((text) => (
            <li key={text} className="flex items-center gap-6 sm:gap-8">
              <span className="size-1 shrink-0 rounded-full bg-navy-300" aria-hidden />
              {text}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
