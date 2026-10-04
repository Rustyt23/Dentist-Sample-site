import { Clock, MapPin, PhoneCall } from "lucide-react";
import { clinic } from "@/lib/data/clinic";
import { Container } from "@/components/ui/Container";

export function TopBar() {
  return (
    <div className="hidden bg-navy-950 text-[0.8rem] text-navy-200 lg:block">
      <Container className="flex h-10 items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2">
            <Clock className="size-3.5 text-brand-300" aria-hidden />
            Mon–Fri {clinic.hours[0].time} · Sat {clinic.hours[1].time}
          </span>
          <span className="flex items-center gap-2">
            <MapPin className="size-3.5 text-brand-300" aria-hidden />
            {clinic.address.line2}, {clinic.address.city}
          </span>
        </div>
        <a
          href={clinic.emergencyPhoneHref}
          className="flex items-center gap-2 font-medium text-white transition-colors hover:text-brand-300"
        >
          <PhoneCall className="size-3.5 text-brand-300" aria-hidden />
          Dental emergency? <span className="text-brand-200">{clinic.emergencyPhone}</span>
        </a>
      </Container>
    </div>
  );
}
