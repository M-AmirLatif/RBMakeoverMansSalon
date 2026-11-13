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
    tagline: "Shampoo, styling, manicure, pedicure, and grooming packages.",
    image: {
      src: "/images/service-shampoo-station.jpg",
      webp: "/images/service-shampoo-station.webp",
      alt: "Shampoo and washing station at R.B Makeover",
    },
    services: [
      { id: "mani-pedi", name: "Mani & Pedicure", category: "grooming", price: "Rs. 2,500", numeric_price: 2500 },
      { id: "manicure", name: "Manicure", category: "grooming", price: "Rs. 1,500", numeric_price: 1500 },
      { id: "pedicure", name: "Pedicure", category: "grooming", price: "Rs. 1,500", numeric_price: 1500 },
      { id: "hair-and-beard-styling", name: "Hair and Beard Styling", category: "grooming", price: "Rs. 1,500", numeric_price: 1500 },
      { id: "grooming-packages", name: "VIP Grooming Packages", category: "grooming", price: "Rs. 3,500", numeric_price: 3500 },
      { id: "shampoo-conditioning", name: "Shampoo & Conditioning", category: "grooming", price: "Rs. 600", numeric_price: 600 },
      { id: "eyebrow-trimming", name: "Eyebrow Trimming", category: "grooming", price: "Rs. 300", numeric_price: 300 },
    ],
  },
];

export const allServices: ServiceItem[] = serviceCategories.flatMap(
  (category) => category.services
);
