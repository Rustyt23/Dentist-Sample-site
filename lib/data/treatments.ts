export type TreatmentCategory = "Preventive" | "Restorative" | "Orthodontics" | "Cosmetic" | "Surgical" | "Kids";

export type TreatmentIconKey =
  | "checkup"
  | "cleaning"
  | "rootCanal"
  | "implant"
  | "aligners"
  | "whitening"
  | "crown"
  | "extraction"
  | "kids"
  | "makeover";

export type Treatment = {
  slug: string;
  name: string;
  icon: TreatmentIconKey;
  category: TreatmentCategory;
  summary: string;
  description: string;
  price: string;
  priceNote?: string;
  duration: string;
  visits: string;
  highlights: string[];
  /** Short dental-specific badge, e.g. "Single sitting" */
  tag: string;
  featured?: { image: string; alt: string };
};

export const treatmentCategories: TreatmentCategory[] = [
  "Preventive",
  "Restorative",
  "Orthodontics",
  "Cosmetic",
  "Surgical",
  "Kids",
];

export const treatments: Treatment[] = [
  {
    slug: "dental-checkup",
    name: "Dental Check-up",
    icon: "checkup",
    category: "Preventive",
    summary: "A thorough exam, oral cancer screening and a clear plan — in one relaxed visit.",
    description:
      "Your dentist checks every tooth, your gums, bite and soft tissues, then walks you through what they see on screen. You leave with a written, prioritised plan and no pressure to start anything the same day.",
    price: "₹500",
    priceNote: "Digital X-ray from ₹300",
    duration: "30 min",
    visits: "1 visit",
    highlights: ["Intraoral camera walkthrough", "Gum & oral cancer screening", "Written treatment plan"],
    tag: "Every 6 months",
  },
  {
    slug: "teeth-cleaning",
    name: "Teeth Cleaning",
    icon: "cleaning",
    category: "Preventive",
    summary: "Ultrasonic scaling and polishing that removes tartar and stains, gently.",
    description:
      "Our hygienists use ultrasonic scalers and air polishing to lift tartar and surface stains without scraping. Ideal every six months to keep gums healthy and breath fresh.",
    price: "₹1,200",
    duration: "45 min",
    visits: "1 visit",
    highlights: ["Ultrasonic scaling", "Air polishing for stains", "Home-care coaching"],
    tag: "Most booked",
  },
  {
    slug: "root-canal",
    name: "Root Canal",
    icon: "rootCanal",
    category: "Restorative",
    summary: "Painless, rotary root canal treatment that saves your natural tooth.",
    description:
      "Using rotary endodontics and apex locators, we clean and seal the infected canal under profound local anaesthesia. Most root canals are completed in a single, comfortable sitting.",
    price: "₹4,500",
    priceNote: "Crown priced separately",
    duration: "60–90 min",
    visits: "1–2 visits",
    highlights: ["Single-sitting option", "Rotary & apex-locator precision", "Profound numbing"],
    tag: "Single sitting",
  },
  {
    slug: "dental-implants",
    name: "Dental Implants",
    icon: "implant",
    category: "Surgical",
    summary: "Permanent, natural-looking replacements for missing teeth.",
    description:
      "A titanium implant fused with your jawbone supports a custom ceramic crown that looks, feels and functions like a natural tooth. Planned with 3D CBCT imaging for precise, predictable placement.",
    price: "₹28,000",
    priceNote: "Per implant, crown included",
    duration: "3–6 months",
    visits: "3–4 visits",
    highlights: ["3D CBCT-guided planning", "Premium Swiss & Korean implant systems", "Lifetime implant warranty"],
    tag: "Lifetime warranty",
    featured: {
      image: "1593022356769-11f762e25ed9",
      alt: "Dental implant model showing an implant post beside natural teeth",
    },
  },
  {
    slug: "braces-aligners",
    name: "Braces / Aligners",
    icon: "aligners",
    category: "Orthodontics",
    summary: "Metal, ceramic or clear aligners to straighten teeth at any age.",
    description:
      "Choose from discreet ceramic braces or nearly invisible clear aligners. A digital scan lets you preview your final smile before you begin, with check-ins every 6–8 weeks.",
    price: "₹35,000",
    priceNote: "Clear aligners from ₹85,000",
    duration: "9–18 months",
    visits: "Monthly reviews",
    highlights: ["3D digital smile preview", "Ceramic & clear options", "Easy monthly EMIs"],
    tag: "Nearly invisible",
  },
  {
    slug: "teeth-whitening",
    name: "Teeth Whitening",
    icon: "whitening",
    category: "Cosmetic",
    summary: "Safe in-clinic whitening for a visibly brighter smile in one hour.",
    description:
      "Professional-grade whitening gel activated under controlled LED light lifts deep stains safely. Most patients see 4–8 shades of improvement in a single session.",
    price: "₹8,000",
    duration: "60 min",
    visits: "1 visit",
    highlights: ["Up to 8 shades brighter", "Gum protection barrier", "Low-sensitivity formula"],
    tag: "Results in 1 hour",
  },
  {
    slug: "crowns-bridges",
    name: "Crowns & Bridges",
    icon: "crown",
    category: "Restorative",
    summary: "Strong, natural-looking ceramic crowns and bridges, precisely fitted.",
    description:
      "Restore cracked, weakened or missing teeth with zirconia and E.max ceramics shade-matched to your smile. Digital impressions mean no messy trays and a more accurate fit.",
    price: "₹6,000",
    priceNote: "Per unit",
    duration: "2 × 45 min",
    visits: "2 visits",
    highlights: ["Zirconia & E.max ceramics", "Digital impressions", "Shade-matched to your teeth"],
    tag: "Digital fit",
  },
  {
    slug: "tooth-extraction",
    name: "Tooth Extraction",
    icon: "extraction",
    category: "Surgical",
    summary: "Gentle simple and wisdom tooth removal with careful aftercare.",
    description:
      "When a tooth can't be saved, we remove it as atraumatically as possible to protect the surrounding bone — including impacted wisdom teeth — with clear aftercare and follow-up.",
    price: "₹1,000",
    priceNote: "Wisdom tooth surgery from ₹4,500",
    duration: "30–45 min",
    visits: "1 visit + review",
    highlights: ["Atraumatic technique", "Wisdom tooth surgery", "Same-day emergency slots"],
    tag: "Same-day relief",
  },
  {
    slug: "kids-dentistry",
    name: "Kids Dentistry",
    icon: "kids",
    category: "Kids",
    summary: "Friendly, fear-free dental care that helps children love their check-ups.",
    description:
      "Our pediatric dentist uses tell-show-do techniques, fluoride varnish and sealants to keep little teeth healthy — in a calm room designed to make kids feel at ease.",
    price: "₹600",
    duration: "30 min",
    visits: "1 visit",
    highlights: ["Fluoride & sealants", "Fear-free approach", "Habit & growth guidance"],
    tag: "Fear-free",
  },
  {
    slug: "smile-makeover",
    name: "Smile Makeover",
    icon: "makeover",
    category: "Cosmetic",
    summary: "A personalised plan combining veneers, whitening and contouring.",
    description:
      "We design your new smile digitally first, so you can see and approve it before treatment begins. Combines veneers, whitening, gum contouring and bonding as needed.",
    price: "Custom plan",
    priceNote: "Design consultation ₹1,000",
    duration: "2–4 weeks",
    visits: "2–4 visits",
    highlights: ["Digital smile design", "Preview before you commit", "Veneers & bonding"],
    tag: "Preview first",
    featured: {
      image: "1769559893692-c6d0623bf8e4",
      alt: "Close-up of a bright, even smile after cosmetic dental treatment",
    },
  },
];

export function getTreatment(slug: string | null | undefined) {
  return treatments.find((t) => t.slug === slug);
}

export function formatPrice(price: string) {
  return price.startsWith("₹") ? `From ${price}` : price;
}

/** Length of the booked visit; multi-month treatments start with a consultation. */
export function visitLength(t: Treatment) {
  return /min/.test(t.duration) && !/×/.test(t.duration) ? t.duration : "45 min consultation";
}
