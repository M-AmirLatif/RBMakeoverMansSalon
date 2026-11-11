/**
 * NOTE FOR OWNER & DEVELOPER:
 * This service list is compiled directly from Google listing info and reviews and must be confirmed by the owner.
 */

export interface ServiceItem {
  id: string;
  name: string;
  category: ServiceCategoryKey;
}

export type ServiceCategoryKey =
  | "haircuts"
  | "beard"
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
    tagline: "Haircuts and styling services for men and boys.",
    image: {
      src: "/images/service-beard-trimming.jpg",
      webp: "/images/service-beard-trimming.webp",
      alt: "Hair styling and cutting at R.B Makeover",
    },
    services: [
      { id: "mens-haircuts", name: "Men's Haircuts", category: "haircuts" },
      { id: "kids-haircuts", name: "Kids' Haircuts", category: "haircuts" },
      { id: "custom-haircuts", name: "Custom Haircuts", category: "haircuts" },
      { id: "fade-haircuts", name: "Fade Haircuts", category: "haircuts" },
      { id: "scissor-cuts", name: "Scissor Cuts", category: "haircuts" },
      { id: "long-haircuts", name: "Long Haircuts", category: "haircuts" },
      { id: "curly-hair-styling", name: "Curly Hair Styling", category: "haircuts" },
      { id: "hair-shaving", name: "Hair Shaving", category: "haircuts" },
      { id: "hair-coloring", name: "Hair Coloring", category: "haircuts" },
      { id: "hair-straightening", name: "Hair Straightening", category: "haircuts" },
      { id: "hair-treatments", name: "Hair Treatments", category: "haircuts" },
    ],
  },
  {
    key: "beard",
    title: "Beard & Grooming",
    shortTitle: "Beard Care",
    tagline: "Beard trimming, grooming, and shaving services.",
    image: {
      src: "/images/tools-styling-vanity.jpg",
      webp: "/images/tools-styling-vanity.webp",
      alt: "Grooming tools and styling console at R.B Makeover",
    },
    services: [
      { id: "beard-trimming", name: "Beard Trimming", category: "beard" },
      { id: "beard-conditioning", name: "Beard Conditioning", category: "beard" },
      { id: "beard-dyeing", name: "Beard Dyeing", category: "beard" },
      { id: "professional-shaving", name: "Professional Shaving", category: "beard" },
    ],
  },
  {
    key: "facial",
    title: "Facial & Skincare",
    shortTitle: "Facial & Skin",
    tagline: "Facial massage and skincare services.",
    image: {
      src: "/images/service-skincare-products.jpg",
      webp: "/images/service-skincare-products.webp",
      alt: "Skincare and facial treatment display at R.B Makeover",
    },
    services: [
      { id: "facial-massage", name: "Facial Massage", category: "facial" },
      { id: "facial-treatments", name: "Facial Treatments", category: "facial" },
      { id: "skincare-services", name: "Skincare Services", category: "facial" },
    ],
  },
  {
    key: "grooming",
    title: "Additional Grooming Services",
    shortTitle: "Additional Care",
    tagline: "Shampoo, styling, manicure, and grooming packages.",
    image: {
      src: "/images/service-shampoo-station.jpg",
      webp: "/images/service-shampoo-station.webp",
      alt: "Shampoo and washing station at R.B Makeover",
    },
    services: [
      { id: "hair-and-beard-styling", name: "Hair and Beard Styling", category: "grooming" },
      { id: "shampoo-conditioning", name: "Shampoo & Conditioning", category: "grooming" },
      { id: "grooming-packages", name: "Grooming Packages", category: "grooming" },
      { id: "mens-manicure", name: "Men's Manicure", category: "grooming" },
      { id: "eyebrow-trimming", name: "Eyebrow Trimming", category: "grooming" },
    ],
  },
];

export const allServices: ServiceItem[] = serviceCategories.flatMap(
  (category) => category.services
);
