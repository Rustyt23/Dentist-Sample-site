import { ArrowLeft, CalendarCheck } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Accent } from "@/components/ui/SectionHeading";
import { ToothIcon } from "@/components/icons";

export default function NotFound() {
  return (
    <section className="bg-linear-to-b from-mist-100/70 to-white">
      <Container className="flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
        <span className="grid size-20 place-items-center rounded-3xl bg-white text-brand-600 shadow-soft ring-1 ring-navy-100">
          <ToothIcon size={40} />
        </span>
        <p className="mt-8 text-sm font-semibold tracking-[0.18em] text-brand-600 uppercase">Error 404</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          This page seems to be <Accent>missing.</Accent>
        </h1>
        <p className="mt-5 max-w-md text-lg text-navy-500">
          Unlike your next check-up, this page doesn&apos;t exist. Let&apos;s get you back on track.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/" variant="secondary">
            <ArrowLeft className="size-4" aria-hidden />
            Back to home
          </ButtonLink>
          <ButtonLink href="/book">
            <CalendarCheck className="size-4" aria-hidden />
            Book Appointment
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
