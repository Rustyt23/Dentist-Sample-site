export type Doctor = {
  slug: string;
  name: string;
  shortName: string;
  role: string;
  qualifications: string;
  experience: string;
  image: string;
  imageAlt: string;
  bio: string;
  longBio: string;
  quote: string;
  expertise: string[];
  /** Treatment slugs this dentist is recommended for */
  treatments: string[];
  education: string[];
  languages: string[];
  /** Working days, 0 = Sunday … 6 = Saturday */
  workDays: number[];
  stats: { value: string; label: string }[];
};

// Sample profiles for the demo — names, credentials and photos are illustrative.
export const doctors: Doctor[] = [
  {
    slug: "dr-ananya-mehra",
    name: "Dr. Ananya Mehra",
    shortName: "Dr. Ananya",
    role: "Founder · Implantologist & Prosthodontist",
    qualifications: "BDS, MDS (Prosthodontics)",
    experience: "14 years",
    image: "1706565029539-d09af5896340",
    imageAlt: "Portrait of Dr. Ananya Mehra in a white clinical coat",
    bio: "Ananya founded SmileCare to make advanced implant and cosmetic dentistry feel calm, unhurried and honest.",
    longBio:
      "Ananya leads our implant and smile design programme. Trained in guided implant surgery and digital smile design, she is known for meticulous planning, natural-looking results and taking the time to explain every option clearly.",
    quote: "A great result starts with listening. I never plan a smile until I understand the person behind it.",
    expertise: ["Dental implants", "Smile makeovers", "Crowns & bridges", "Full-mouth rehabilitation"],
    treatments: [
      "dental-implants",
      "smile-makeover",
      "crowns-bridges",
      "teeth-whitening",
      "dental-checkup",
      "tooth-extraction",
    ],
    education: ["MDS, Prosthodontics — Manipal College of Dental Sciences", "Fellowship, Oral Implantology"],
    languages: ["English", "Hindi", "Kannada"],
    workDays: [1, 2, 3, 4, 5],
    stats: [
      { value: "2,000+", label: "Implants placed" },
      { value: "4.9★", label: "Patient rating" },
    ],
  },
  {
    slug: "dr-arjun-kapoor",
    name: "Dr. Arjun Kapoor",
    shortName: "Dr. Arjun",
    role: "Orthodontist",
    qualifications: "BDS, MDS (Orthodontics)",
    experience: "10 years",
    image: "1674775372058-c4c8813c6611",
    imageAlt: "Portrait of Dr. Arjun Kapoor smiling in the clinic",
    bio: "Arjun straightens smiles with braces and clear aligners, planning every case digitally from day one.",
    longBio:
      "Arjun is a certified clear-aligner provider who has treated over 1,200 orthodontic cases. He combines 3D scanning with a friendly, practical approach that works for busy teens and adults alike.",
    quote: "Straight teeth are the bonus. A healthy, comfortable bite that lasts a lifetime is the real goal.",
    expertise: ["Clear aligners", "Ceramic braces", "Bite correction", "Teen orthodontics"],
    treatments: ["braces-aligners", "smile-makeover", "dental-checkup", "teeth-cleaning"],
    education: ["MDS, Orthodontics — Government Dental College, Bengaluru", "Certified clear-aligner provider"],
    languages: ["English", "Hindi", "Punjabi"],
    workDays: [2, 3, 4, 5, 6],
    stats: [
      { value: "1,200+", label: "Smiles aligned" },
      { value: "4.9★", label: "Patient rating" },
    ],
  },
  {
    slug: "dr-kavya-nair",
    name: "Dr. Kavya Nair",
    shortName: "Dr. Kavya",
    role: "Pediatric & Family Dentist",
    qualifications: "BDS, MDS (Pedodontics)",
    experience: "8 years",
    image: "1757125736482-328a3cdd9743",
    imageAlt: "Portrait of Dr. Kavya Nair in a white coat, smiling outdoors",
    bio: "Kavya makes dental visits easy for children and anxious adults, with a gentle, step-by-step approach.",
    longBio:
      "Kavya specialises in children's dentistry and pain-aware care for nervous patients. From first teeth to teenage check-ups, she focuses on prevention and building positive habits that last a lifetime.",
    quote: "If a child leaves smiling and asks when they can come back, I know we've done our job.",
    expertise: ["Kids dentistry", "Preventive care", "Painless root canals", "Anxious patients"],
    treatments: [
      "kids-dentistry",
      "root-canal",
      "dental-checkup",
      "teeth-cleaning",
      "tooth-extraction",
      "teeth-whitening",
    ],
    education: ["MDS, Pedodontics — Saveetha Dental College, Chennai", "Certificate, Conscious Sedation"],
    languages: ["English", "Malayalam", "Tamil"],
    workDays: [1, 3, 5, 6],
    stats: [
      { value: "3,500+", label: "Young patients" },
      { value: "5.0★", label: "Parent rating" },
    ],
  },
];

export const WEEKDAY_INITIALS = ["S", "M", "T", "W", "T", "F", "S"];
const WEEKDAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Human-readable working days, e.g. "Mon – Fri" or "Mon, Wed, Fri, Sat" */
export function formatWorkDays(days: number[]) {
  const sorted = [...days].sort((a, b) => a - b);
  const contiguous = sorted.every((d, i) => i === 0 || d === sorted[i - 1] + 1);
  if (contiguous && sorted.length > 2) return `${WEEKDAY_SHORT[sorted[0]]} – ${WEEKDAY_SHORT[sorted.at(-1)!]}`;
  return sorted.map((d) => WEEKDAY_SHORT[d]).join(", ");
}

export function getDoctor(slug: string | null | undefined) {
  return doctors.find((d) => d.slug === slug);
}
