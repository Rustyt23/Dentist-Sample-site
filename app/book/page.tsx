import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ChevronRight, Clock, ShieldCheck, Star } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Accent, Eyebrow } from "@/components/ui/SectionHeading";
import { BookingFlow } from "@/components/book/BookingFlow";

export const metadata: Metadata = {
  title: "Book an Appointment",
  description:
    "Choose a treatment, dentist and time that suits you. Appointment requests are confirmed by call or WhatsApp within 15 minutes.",
};

const assurances = [
  { icon: Clock, text: "Confirmed within 15 min" },
  { icon: ShieldCheck, text: "Free rescheduling" },
  { icon: Star, text: "4.9 patient rating" },
];

function BookingSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8" aria-hidden>
      <div className="h-[36rem] animate-pulse rounded-[1.75rem] bg-white ring-1 ring-navy-100 lg:col-span-8" />
      <div className="hidden h-96 animate-pulse rounded-[1.75rem] bg-white ring-1 ring-navy-100 lg:col-span-4 lg:block" />
    </div>
  );
}

export default function BookPage() {
  return (
    <div className="bg-linear-to-b from-mist-100/70 via-mist-50/40 to-white pb-16 sm:pb-24">
      <Container className="pt-8 sm:pt-12">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-1.5 text-sm text-navy-400">
            <li>
              <Link href="/" className="transition-colors hover:text-navy-900">
                Home
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="size-3.5" />
            </li>
            <li aria-current="page" className="font-medium text-navy-700">
              Book appointment
            </li>
          </ol>
        </nav>

        <div className="mt-6 flex flex-col justify-between gap-6 sm:mt-8 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <Eyebrow>Book an appointment</Eyebrow>
            <h1 className="mt-4 text-[2.1rem] leading-[1.08] font-semibold tracking-[-0.03em] sm:mt-5 sm:text-5xl">
              Your visit, <Accent>in under a minute.</Accent>
            </h1>
            <p className="mt-5 hidden text-lg leading-relaxed text-navy-500 sm:block">
              Choose a treatment, dentist and time. Our team personally confirms every request by call or WhatsApp.
            </p>
          </div>
          <ul className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
            {assurances.map(({ icon: Icon, text }) => (
              <li
                key={text}
                className="flex shrink-0 items-center gap-2 rounded-full bg-white px-3.5 py-2 text-sm font-medium text-navy-700 shadow-soft ring-1 ring-navy-100"
              >
                <Icon className="size-4 text-brand-600" aria-hidden />
                {text}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 sm:mt-10">
          <Suspense fallback={<BookingSkeleton />}>
            <BookingFlow />
          </Suspense>
        </div>
      </Container>
    </div>
  );
}
