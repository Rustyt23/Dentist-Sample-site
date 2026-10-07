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
import { getTreatment } from "@/lib/data/treatments";

const price = (slug: string) => Number((getTreatment(slug)?.price ?? "0").replace(/[^\d]/g, ""));
const rupees = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;
const toothPrices = {
  enamel: rupees(price("dental-checkup")),
  dentin: "₹1,500",
  pulp: rupees(price("root-canal") + price("crowns-bridges")),
  root: rupees(price("dental-implants")),
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustSection />
      <div className="space-y-16 py-16 sm:space-y-20 sm:py-20 lg:space-y-28 lg:py-28">
        <PopularTreatments />
        <InsideYourTooth prices={toothPrices} />
        <WhyChooseUs />
        <DoctorsSection />
        <SmileTransformations />
        <Testimonials />
        <GalleryPreview />
        <FAQ />
        <VisitClinic />
      </div>
    </>
  );
}
