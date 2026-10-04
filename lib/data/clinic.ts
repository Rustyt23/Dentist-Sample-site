// All clinic details are sample data for the demo — edit here to rebrand the site.

export const clinic = {
  name: "SmileCare Dental Clinic",
  shortName: "SmileCare",
  tagline: "Gentle, modern dentistry for the whole family.",
  phone: "+91 98765 43210",
  phoneHref: "tel:+919876543210",
  whatsapp: "+91 98765 43210",
  whatsappHref:
    "https://wa.me/919876543210?text=Hi%20SmileCare%2C%20I%27d%20like%20to%20book%20a%20dental%20appointment.",
  email: "hello@smilecaredental.in",
  emergencyPhone: "+91 98765 00911",
  emergencyPhoneHref: "tel:+919876500911",
  address: {
    line1: "2nd Floor, Lotus Square",
    line2: "100 Feet Road, Indiranagar",
    city: "Bengaluru",
    region: "Karnataka",
    postalCode: "560038",
  },
  landmark: "Above Indiranagar Metro exit B · Free parking at rear",
  directionsHref: "https://www.google.com/maps/search/?api=1&query=Indiranagar+100+Feet+Road+Bengaluru",
  hours: [
    { days: "Monday – Friday", time: "9:30 AM – 8:30 PM" },
    { days: "Saturday", time: "9:30 AM – 6:00 PM" },
    { days: "Sunday", time: "By appointment only" },
  ],
  stats: [
    { value: "12+", label: "Years of care" },
    { value: "15,000+", label: "Smiles treated" },
    { value: "4.9★", label: "Average rating" },
    { value: "3", label: "Specialist dentists" },
  ],
} as const;

export const fullAddress = `${clinic.address.line1}, ${clinic.address.line2}, ${clinic.address.city} ${clinic.address.postalCode}`;

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Treatments", href: "/treatments" },
  { label: "Doctors", href: "/doctors" },
  { label: "Gallery", href: "/gallery" },
  { label: "Reviews", href: "/#reviews" },
  { label: "Contact", href: "/contact" },
] as const;
