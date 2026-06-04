// Default values for all homepage sections
// This is a plain data file — NOT a server action file
export const HOMEPAGE_DEFAULTS = {
  hero: {
    tagline: "Dubai's #1 Mobile Car Wash",
    heading: "We Come to You",
    subheading: "Premium car wash & detailing at your doorstep. Same-day luxury service across Dubai.",
    primaryButtonText: "Book Your Wash",
    primaryButtonLink: "/book",
    secondaryButtonText: "WhatsApp Us",
    secondaryButtonLink: "https://wa.me/971555503288",
    stat1Value: "15k+",
    stat1Label: "Cars Washed",
    stat2Value: "100%",
    stat2Label: "Satisfaction",
    badge1: "4.9/5 Rating",
    badge2: "Fully Insured",
    badge3: "Same Day Service",
    isVisible: true,
  },
  trustBar: {
    isVisible: true,
    items: [
      { value: "4.9/5", label: "5-Star Rating" },
      { value: "50+", label: "Professional Detailers" },
      { value: "100%", label: "Insured Services" },
      { value: "2024", label: "Award Winning" },
    ],
  },
  whyChooseUs: {
    isVisible: true,
    badge: "Why Al Haddaf",
    title: "Setting the Gold Standard in",
    titleHighlight: "Mobile Car Care",
    description: "We combine German engineering with Dubai's luxury service standards to deliver perfection at your doorstep.",
    items: [
      { title: "Eco-Friendly Products", description: "We use 100% biodegradable, pH-neutral products safe for your car's paint and the environment." },
      { title: "Certified Detailers", description: "Our team holds international certifications in automotive detailing and paint correction." },
      { title: "Fully Insured", description: "Every service is fully insured. Your vehicle is protected from the moment we arrive." },
      { title: "Same-Day Service", description: "Book in the morning, get your car washed by afternoon. Available 7 days a week." },
    ],
  },
  howItWorks: {
    isVisible: true,
    title: "Four Steps to a",
    titleHighlight: "Pristine Car",
    description: "Our process is designed for maximum convenience and professional results.",
    steps: [
      { number: "01", title: "Choose Your Service", description: "Pick from our range of premium detailing packages designed for Dubai's luxury vehicles." },
      { number: "02", title: "Book Online", description: "Select your preferred date and time slot. We'll confirm within minutes." },
      { number: "03", title: "We Come to You", description: "Our team arrives at your location — home, office, or wherever you are in Dubai." },
      { number: "04", title: "Drive Away Clean", description: "Enjoy your showroom-quality vehicle. Rate us and book your next appointment." },
    ],
  },
  finalCta: {
    isVisible: true,
    badge: "Limited Time Offer",
    title: "Give Your Car the",
    titleHighlight: "Royal Treatment",
    description: "Join thousands of satisfied luxury car owners in Dubai. Book your first premium wash today and get 20% off.",
    primaryButtonText: "Book My Wash Now",
    primaryButtonLink: "/book",
    secondaryButtonText: "Chat with Expert",
    secondaryButtonLink: "https://wa.me/971555503288",
    disclaimer: "*Offer valid for first-time customers across all Dubai service areas.",
  },
  seo: {
    metaTitle: "Al Haddaf Car Wash | Premium Mobile Car Wash Dubai",
    metaDescription: "Premium Mobile Car Wash Services in Dubai. Professional detailing, steam cleaning, and ceramic coating at your doorstep.",
  },
} as const;

export type HomepageSettings = typeof HOMEPAGE_DEFAULTS;
export type SectionKey = keyof HomepageSettings;
