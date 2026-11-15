/**
 * NOTE FOR OWNER & DEVELOPER:
 * This service list is compiled directly from Google listing info and reviews and must be confirmed by the owner.
 */

export interface ServiceItem {
  id: string;
  name: string;
  category: ServiceCategoryKey;
  price?: string;
  numeric_price?: number;
}

export type ServiceCategoryKey =
  | "haircuts"
  | "beard"
  | "coloring"
  | "treatment"
  | "facial"
  | "grooming";

export interface ServiceCategory {
  key: ServiceCategoryKey;
  title: string;
  shortTitle: string;
  tagline: string;
  image: {
    src: string;
    webp: string;
    alt: string;
  };
  services: ServiceItem[];
}

export const serviceCategories: ServiceCategory[] = [
  {
    key: "haircuts",
    title: "Haircuts & Styling",
    shortTitle: "Haircuts",
    tagline: "Tailored men's precision cuts, skin fades, scissor work, and modern gentleman styling.",
    image: {
      src: "/images/service-beard-trimming.jpg",
      webp: "/images/service-beard-trimming.webp",
      alt: "Hair styling and cutting at R.B Makeover",
    },
    services: [
      { id: "mens-haircuts", name: "Men's Haircuts", category: "haircuts" },
      { id: "fade-haircuts", name: "Haircuts & Fades", category: "haircuts" },
      { id: "kids-haircuts", name: "Kids' Haircuts", category: "haircuts" },
      { id: "scissor-cuts", name: "Scissor Cuts", category: "haircuts" },
      { id: "custom-haircuts", name: "Custom Haircuts & Restyling", category: "haircuts" },
      { id: "curly-hair-styling", name: "Curly & Straight Hair Styling", category: "haircuts" },
      { id: "long-haircuts", name: "Long Haircuts & Layering", category: "haircuts" },
      { id: "hair-shaving", name: "Full Head Shaving (Clean Razor)", category: "haircuts" },
    ],
  },
  {
    key: "beard",
    title: "Beard & Grooming",
    shortTitle: "Beard Care",
    tagline: "Beard trimming, precision line-ups, and hot towel straight razor shaving.",
    image: {
      src: "/images/tools-styling-vanity.jpg",
      webp: "/images/tools-styling-vanity.webp",
      alt: "Grooming tools and styling console at R.B Makeover",
    },
    services: [
      { id: "beard-trimming", name: "Beard Trimming & Lineup", category: "beard" },
      { id: "professional-shaving", name: "Professional Shaving", category: "beard" },
    ],
  },
  {
    key: "coloring",
    title: "Hair & Beard Coloring",
    shortTitle: "Coloring",
    tagline: "Apple & Coffee premium tints, gray hair coverage, beard dye, and color polishes.",
    image: {
      src: "/images/cutout-mature-classic.webp",
      webp: "/images/cutout-mature-classic.webp",
      alt: "Hair coloring and dye services at R.B Makeover",
    },
    services: [
      { id: "hair-coloring", name: "Apple Hair Coloring", category: "coloring" },
      { id: "apple-beard-color", name: "Apple Beard Color", category: "coloring" },
      { id: "coffee-premium-hair-color", name: "Coffee Premium Hair Color", category: "coloring" },
      { id: "coffee-premium-hair-polish", name: "Coffee Premium Hair Polish", category: "coloring" },
      { id: "coffee-premium-beard-color", name: "Coffee Premium Beard Color", category: "coloring" },
      { id: "coffee-premium-beard-polish", name: "Coffee Premium Beard Polish", category: "coloring" },
      { id: "beard-dye", name: "Beard Dyeing & Conditioning", category: "coloring" },
    ],
  },
  {
    key: "treatment",
    title: "Hair Treatments & Spa",
    shortTitle: "Hair Treatments",
    tagline: "Keratin silk smoothing, restorative protein treatments, and Enzo hair spa therapies.",
    image: {
      src: "/images/service-shampoo-station.jpg",
      webp: "/images/service-shampoo-station.webp",
      alt: "Hair treatments and scalp spa at R.B Makeover",
    },
    services: [
      { id: "hair-straightening", name: "Hair Straightening", category: "treatment" },
      { id: "hair-treatments", name: "Keratin & Protein Hair Treatment", category: "treatment" },
      { id: "beard-conditioning", name: "Enzo Hair Spa Treatments", category: "treatment" },
    ],
  },
  {
    key: "facial",
    title: "Facial & Skincare",
    shortTitle: "Facial & Skin",
    tagline: "Deep pore cleansing, Johnson facials, botanical steam, and VIP royal gold facials.",
    image: {
      src: "/images/service-skincare-products.jpg",
      webp: "/images/service-skincare-products.webp",
      alt: "Skincare and facial treatment display at R.B Makeover",
    },
    services: [
      { id: "facial-massage", name: "Johnson Facial Cleansing", category: "facial" },
      { id: "johnson-facial-", name: "Johnson Facial", category: "facial" },
      { id: "skincare-services", name: "Deep Pore Skincare & Scrub", category: "facial" },
      { id: "gold-facial", name: "VIP Royal Gold Facial", category: "facial" },
    ],
  },
  {
    key: "grooming",
    title: "VIP Grooming & Packages",
    shortTitle: "VIP Packages",
    tagline: "Luxury manicure, pedicure, hair & beard combos, and full VIP grooming packages.",
    image: {
      src: "/images/cutout-master-finish.webp",
      webp: "/images/cutout-master-finish.webp",
      alt: "VIP Grooming Packages at R.B Makeover",
    },
    services: [
      { id: "mani-pedi", name: "Mani & Pedicure", category: "grooming", price: "Rs. 2,500", numeric_price: 2500 },
      { id: "manicure", name: "Manicure", category: "grooming", price: "Rs. 1,500", numeric_price: 1500 },
      { id: "pedicure", name: "Pedicure", category: "grooming", price: "Rs. 1,500", numeric_price: 1500 },
      { id: "hair-and-beard-styling", name: "Hair & Beard Complete Styling Combo", category: "grooming", price: "Rs. 1,000", numeric_price: 1000 },
      { id: "vip-grooming", name: "VIP Complete Grooming Package", category: "grooming", price: "Rs. 3,500", numeric_price: 3500 },
      { id: "shampoo-conditioning", name: "Luxury Shampoo & Conditioning", category: "grooming", price: "Rs. 500", numeric_price: 500 },
      { id: "eyebrow-trimming", name: "Eyebrow Shaping & Trimming", category: "grooming", price: "Rs. 300", numeric_price: 300 },
    ],
  },
];

export const allServices: ServiceItem[] = serviceCategories.flatMap(
  (category) => category.services
);
