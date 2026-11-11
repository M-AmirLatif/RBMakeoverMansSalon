export interface SalonImage {
  id: string;
  src: string;
  webp: string;
  alt: string;
  title: string;
  category: "Interiors" | "Styling" | "Storefront";
  width: number;
  height: number;
  aspectRatio: "portrait" | "landscape" | "square";
  featured?: boolean;
}

/**
 * Gallery images strictly selected:
 * - Does NOT include hero photo (/images/hero-styling-stations.webp)
 * - Does NOT include about photo (/images/about-interior-floor.webp)
 * - Excludes signboard to eliminate phone and name discrepancies
 * - Includes staff photo moved from Team section
 * - Wide stations photo is cropped clean with 0 black pillarbox bars
 * - 8 items engineered to end 100% flush in 3-col desktop and 2-col mobile grids
 */
export const galleryImages: SalonImage[] = [
  {
    id: "salon-panoramic-view",
    src: "/images/salon-wide-stations.jpg",
    webp: "/images/salon-wide-stations.webp",
    alt: "Panoramic view of styling stations and illuminated mirrors at R.B Makeover",
    title: "Main Styling Room",
    category: "Interiors",
    width: 1165,
    height: 1470,
    aspectRatio: "landscape",
    featured: true, // Spans 2 cols on desktop and mobile
  },
  {
    id: "tools-vanity-station",
    src: "/images/tools-styling-vanity.jpg",
    webp: "/images/tools-styling-vanity.webp",
    alt: "Styling tools and vanity console at R.B Makeover",
    title: "Styling Console",
    category: "Styling",
    width: 1350,
    height: 1800,
    aspectRatio: "portrait",
  },
  {
    id: "service-beard-action",
    src: "/images/service-beard-trimming.jpg",
    webp: "/images/service-beard-trimming.webp",
    alt: "Hair cutting and beard grooming at R.B Makeover Man's Salon",
    title: "Hair and Beard Work",
    category: "Styling",
    width: 1350,
    height: 1800,
    aspectRatio: "portrait",
  },
  {
    id: "service-shampoo-nook",
    src: "/images/service-shampoo-station.jpg",
    webp: "/images/service-shampoo-station.webp",
    alt: "Hair washing and shampoo station at R.B Makeover",
    title: "Shampoo Station",
    category: "Interiors",
    width: 1350,
    height: 1800,
    aspectRatio: "portrait",
  },
  {
    id: "station-arched-damask",
    src: "/images/styling-station-arched.jpg",
    webp: "/images/styling-station-arched.webp",
    alt: "Styling station with arched mirror at R.B Makeover",
    title: "Arched Mirror Station",
    category: "Interiors",
    width: 675,
    height: 1200,
    aspectRatio: "portrait",
  },
  {
    id: "station-products-black",
    src: "/images/styling-station-products.jpg",
    webp: "/images/styling-station-products.webp",
    alt: "Styling station and chair at R.B Makeover",
    title: "Styling Bay",
    category: "Interiors",
    width: 675,
    height: 1200,
    aspectRatio: "portrait",
  },
  {
    id: "storefront-ext",
    src: "/images/storefront-exterior.jpg",
    webp: "/images/storefront-exterior.webp",
    alt: "Storefront entrance of R.B Makeover Man's Salon at Rose Commercial, Park View City",
    title: "Rose Commercial Storefront",
    category: "Storefront",
    width: 2048,
    height: 1152,
    aspectRatio: "portrait",
  },
  {
    id: "team-staff-craft",
    src: "/images/team-staff-craft.jpg",
    webp: "/images/team-staff-craft.webp",
    alt: "Salon staff at work inside R.B Makeover Man's Salon",
    title: "Staff at the Salon",
    category: "Styling",
    width: 1350,
    height: 1800,
    aspectRatio: "portrait",
  },
];

export const salonImagesManifest = galleryImages;
