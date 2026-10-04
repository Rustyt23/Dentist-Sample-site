// Sample content for the demo. Reviews are illustrative and not from real patients.

export type Review = {
  name: string;
  detail: string;
  treatment: string;
  rating: number;
  quote: string;
};

export const reviews: Review[] = [
  {
    name: "Priya S.",
    detail: "Software engineer",
    treatment: "Clear Aligners",
    rating: 5,
    quote:
      "I was nervous about aligners, but Dr. Arjun showed me a 3D preview of my smile before we started. Eleven months later my teeth are straight and nobody even noticed I was wearing them.",
  },
  {
    name: "Rahul M.",
    detail: "Patient since 2021",
    treatment: "Root Canal",
    rating: 5,
    quote:
      "Honestly the most painless dental experience I've had. They explained every step, checked on me constantly and finished the root canal in one sitting.",
  },
  {
    name: "Neha & Aarav K.",
    detail: "Parent",
    treatment: "Kids Dentistry",
    rating: 5,
    quote:
      "My six-year-old actually asks when his next visit is. Dr. Kavya is wonderful with children — patient, playful and very reassuring for parents too.",
  },
  {
    name: "Vikram R.",
    detail: "Business owner",
    treatment: "Dental Implants",
    rating: 5,
    quote:
      "Transparent pricing from the first consultation, no surprises. My implant feels exactly like a natural tooth and the clinic is spotless.",
  },
  {
    name: "Ayesha T.",
    detail: "Architect",
    treatment: "Teeth Whitening",
    rating: 5,
    quote:
      "Beautiful clinic, zero waiting time and a noticeably brighter smile after one session. The team made it feel more like a spa than a dentist.",
  },
  {
    name: "Sandeep D.",
    detail: "Patient since 2019",
    treatment: "Smile Makeover",
    rating: 5,
    quote:
      "Dr. Ananya designed my veneers digitally and let me approve the look first. The result is natural — friends just say I look well rested.",
  },
];

export type Faq = { question: string; answer: string };

export const faqs: Faq[] = [
  {
    question: "Will my treatment be painful?",
    answer:
      "Most of our treatments are virtually painless. We use topical numbing gel before every injection, computer-controlled local anaesthesia and gentle techniques throughout. If you're anxious, tell us — we'll go at your pace and you can pause anytime by raising a hand.",
  },
  {
    question: "How long does a typical appointment take?",
    answer:
      "A check-up or cleaning takes 30–45 minutes. Fillings and root canals usually take 45–90 minutes. We run on time and keep buffers between patients, so you rarely wait more than a few minutes.",
  },
  {
    question: "Is a root canal really necessary — and how many visits does it need?",
    answer:
      "A root canal saves a tooth whose nerve is infected or inflamed; the alternative is usually extraction. With rotary instruments, most root canals are completed in a single sitting, followed by a crown a week or two later to protect the tooth.",
  },
  {
    question: "Am I too old for braces or aligners?",
    answer:
      "Not at all — healthy teeth can be moved at any age, and many of our orthodontic patients are adults. Clear aligners are especially popular because they are nearly invisible and removable for meals.",
  },
  {
    question: "How long do dental implants last?",
    answer:
      "With good oral hygiene and regular check-ups, implants can last a lifetime. The ceramic crown on top may need replacement after 15+ years. We plan every implant with 3D CBCT imaging and offer a lifetime warranty on the implant itself.",
  },
  {
    question: "Do you take emergency appointments?",
    answer:
      "Yes. We keep same-day slots for dental emergencies such as severe toothache, swelling, broken teeth or knocked-out teeth. Call or WhatsApp us and we'll see you as quickly as possible — even on Sundays.",
  },
  {
    question: "Is professional teeth whitening safe?",
    answer:
      "Yes — when done under dental supervision. We check your teeth and gums first, protect your gums with a barrier and use a low-sensitivity, professional-grade gel. Any mild sensitivity usually settles within 24–48 hours.",
  },
  {
    question: "How often should I get my teeth cleaned?",
    answer:
      "For most people, a check-up and professional cleaning every six months keeps gums healthy and catches problems early. If you have gum disease, braces or diabetes, your dentist may suggest every three to four months.",
  },
  {
    question: "When should my child first see a dentist?",
    answer:
      "By their first birthday, or within six months of the first tooth appearing. Early, gentle visits help children feel at ease and let us spot habits like bottle decay or thumb-sucking before they cause problems.",
  },
  {
    question: "Do you offer EMIs or accept dental insurance?",
    answer:
      "We offer no-cost EMI options on treatments above ₹10,000 and provide detailed invoices for insurance and reimbursement claims. Your estimate is always shared in writing before treatment begins.",
  },
  {
    question: "How do I book?",
    answer: "Book online by choosing your treatment, dentist and preferred appointment time. You can also call or WhatsApp our front desk for help.",
  },
];

export type GalleryCategory = "Reception" | "Treatment Rooms" | "Equipment" | "Interiors";

export type GalleryImage = {
  id: string;
  alt: string;
  caption: string;
  category: GalleryCategory;
  /** Aspect ratio hint for masonry layout */
  shape: "landscape" | "portrait" | "square";
};

export const galleryCategories: GalleryCategory[] = ["Reception", "Treatment Rooms", "Equipment", "Interiors"];

export const gallery: GalleryImage[] = [
  {
    id: "1629909614456-6b1c5c94cecc",
    alt: "Reception lounge with teal sofas and warm wood panelling",
    caption: "Patient lounge",
    category: "Reception",
    shape: "landscape",
  },
  {
    id: "1629909615184-74f495363b67",
    alt: "Bright treatment suite with a modern teal dental chair",
    caption: "Treatment suite 1",
    category: "Treatment Rooms",
    shape: "portrait",
  },
  {
    id: "1770321119305-f191c09c5801",
    alt: "Dental unit with integrated monitor and precision instruments",
    caption: "Integrated digital dental unit",
    category: "Equipment",
    shape: "square",
  },
  {
    id: "1762625570087-6d98fca29531",
    alt: "Calm, minimal waiting area with comfortable seating",
    caption: "Waiting area",
    category: "Reception",
    shape: "portrait",
  },
  {
    id: "1629909613654-28e377c37b09",
    alt: "Spacious treatment room filled with natural light",
    caption: "Treatment suite 2",
    category: "Treatment Rooms",
    shape: "landscape",
  },
  {
    id: "1743511738166-fc0ef2010c14",
    alt: "Minimal white corridor with soft indirect lighting",
    caption: "Clinic corridor",
    category: "Interiors",
    shape: "landscape",
  },
  {
    id: "1600170311833-c2cf5280ce49",
    alt: "Dentist reviewing a 3D dental scan on a tablet",
    caption: "3D intraoral scanning",
    category: "Equipment",
    shape: "landscape",
  },
  {
    id: "1764727291644-5dcb0b1a0375",
    alt: "Modern reception desk with clean lines",
    caption: "Front desk",
    category: "Reception",
    shape: "portrait",
  },
  {
    id: "1643660527098-559f89e45a92",
    alt: "Treatment room with dental chair and patient monitor",
    caption: "Treatment suite 3",
    category: "Treatment Rooms",
    shape: "square",
  },
  {
    id: "1588776814546-1ffcf47267a5",
    alt: "Dentist examining digital X-ray films on a light box",
    caption: "Digital radiography",
    category: "Equipment",
    shape: "landscape",
  },
  {
    id: "1648775507324-b48dd3791fa5",
    alt: "Airy white interior with an indoor tree and natural light",
    caption: "Light-filled interiors",
    category: "Interiors",
    shape: "landscape",
  },
  {
    id: "1787496994867-939269b4d323",
    alt: "Hallway with white panelled walls and framed botanical art",
    caption: "Consultation wing",
    category: "Interiors",
    shape: "portrait",
  },
];

export type Transformation = {
  title: string;
  concern: string;
  doctor: string;
  treatment: string;
  duration: string;
  image: string;
  alt: string;
  /** CSS filter applied to the "before" view to illustrate the change */
  beforeFilter: string;
};

export const transformations: Transformation[] = [
  {
    title: "Brighter, whiter smile",
    concern: "Coffee and tea stains that made her avoid smiling in photos.",
    doctor: "dr-ananya-mehra",
    treatment: "In-clinic Teeth Whitening",
    duration: "1 session · 60 minutes",
    image: "1654373535457-383a0a4d00f9",
    alt: "Close-up of a smile with bright, even teeth",
    beforeFilter: "sepia(0.55) saturate(1.35) brightness(0.86) contrast(0.92) hue-rotate(-8deg)",
  },
  {
    title: "Natural, confident makeover",
    concern: "Dull, uneven front teeth ahead of a family wedding.",
    doctor: "dr-ananya-mehra",
    treatment: "Smile Makeover with Veneers",
    duration: "3 visits · 3 weeks",
    image: "1769559893692-c6d0623bf8e4",
    alt: "Close-up of a confident smile after a smile makeover",
    beforeFilter: "sepia(0.6) saturate(1.2) brightness(0.84) contrast(0.9)",
  },
  {
    title: "Fresh, healthy result",
    concern: "Tartar build-up, bleeding gums and surface staining.",
    doctor: "dr-kavya-nair",
    treatment: "Deep Cleaning & Polishing",
    duration: "2 sessions · 2 weeks",
    image: "1663182234283-28941e7612da",
    alt: "Close-up of a healthy smile after professional cleaning",
    beforeFilter: "sepia(0.45) saturate(1.25) brightness(0.88) contrast(0.94) hue-rotate(-6deg)",
  },
];
