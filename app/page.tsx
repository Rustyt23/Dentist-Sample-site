import { Hero } from "@/components/sections/Hero";
import { TrustSection } from "@/components/sections/TrustSection";
import { PopularTreatments } from "@/components/sections/PopularTreatments";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { InsideYourTooth } from "@/components/sections/InsideYourTooth";
import { DoctorsSection } from "@/components/sections/DoctorsSection";
import { SmileTransformations } from "@/components/sections/SmileTransformations";
import { Testimonials } from "@/components/sections/Testimonials";
import { GalleryPreview } from "@/components/sections/GalleryPreview";
import { FAQ } from "@/components/sections/FAQ";
import { VisitClinic } from "@/components/sections/VisitClinic";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { EmergencyBanner } from "@/components/sections/EmergencyCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustSection />
      <PopularTreatments />
      <InsideYourTooth />
      <WhyChooseUs />
      <DoctorsSection />
      <SmileTransformations />
      <Testimonials />
      <GalleryPreview />
      <FAQ />
      <EmergencyBanner className="pt-0 pb-16 sm:pb-20" />
      <VisitClinic />
      <FinalCTA />
    </>
  );
}
