/**
 * NOTE FOR SALON OWNER & DEVELOPER:
 * All business details in this file are restricted strictly to verified facts from the brief.
 * The final service list, social media URL, and exact Google Maps pin must be confirmed by owner Imtiaz Ahmad.
 */

export interface SiteConfig {
  name: string;
  legalName: string;
  tagline: string;
  shortDescription: string;
  longDescription: string;
  owner: {
    name: string;
    statement: string;
  };
  contact: {
    primaryPhone: string;
    primaryPhoneRaw: string;
    whatsappNumber: string;
    whatsappUrl: string;
    email: string;
    address: {
      street: string;
      commercialArea: string;
      mainBoulevard: string;
      society: string;
      city: string;
      country: string;
      formatted: string;
    };
    social: {
      handle: string;
      facebookUrl: string;
    };
  };
  stats: {
    rating: number;
    maxRating: number;
    reviewCount: number;
    servicesCount: number;
    locationShort: string;
  };
  maps: {
    officialUrl: string;
    searchUrl: string;
    directionsUrl: string;
    embedUrl: string;
  };
  seo: {
    siteUrl: string;
    title: string;
    description: string;
    keywords: string[];
  };
}

export const siteConfig: SiteConfig = {
  name: "R.B Makeover Man's Salon",
  legalName: "R.B Makeover Men's Salon",
  tagline: "Men's haircuts, beard grooming and skincare in Park View City, Lahore",
  shortDescription:
    "Men's salon providing haircuts, beard grooming, and facial skincare in Park View City, Lahore.",
  longDescription:
    "R.B Makeover Man's Salon is located at Rose Commercial, Main Boulevard, Park View City, Lahore. We offer haircuts, beard styling, and skincare services with a committed staff.",
  owner: {
    name: "Imtiaz Ahmad",
    statement:
      "Owner Imtiaz Ahmad built R.B Makeover around giving Park View City the best service, backed by a good staff.",
  },
  contact: {
    primaryPhone: "0326 9326566",
    primaryPhoneRaw: "+923269326566",
    whatsappNumber: "923269326566",
    whatsappUrl: "https://wa.me/923269326566",
    email: "r.bmakeover92@gmail.com",
    address: {
      street: "Rose Commercial",
      commercialArea: "Rose Commercial",
      mainBoulevard: "Main Boulevard",
      society: "Park View City",
      city: "Lahore",
      country: "Pakistan",
      formatted: "Rose Commercial, Main Boulevard, Park View City, Lahore, Pakistan",
    },
    social: {
      handle: "r.bmakeover",
      facebookUrl: "https://www.facebook.com/r.bmakeover",
    },
  },
  stats: {
    rating: 4.9,
    maxRating: 5.0,
    reviewCount: 36,
    servicesCount: 23,
    locationShort: "Park View City, Lahore",
  },
  maps: {
    officialUrl: "https://maps.app.goo.gl/t8HE1C2fTC1xCRdk9?g_st=aw",
    searchUrl: "https://maps.app.goo.gl/t8HE1C2fTC1xCRdk9?g_st=aw",
    directionsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=92%2C+R.B+Makeover+Man%27s+Salon+%7C+Park+View+City%2C+Rose+Commercial%2C+Lahore",
    embedUrl:
      "https://maps.google.com/maps?q=92%2C+R.B+Makeover+Man%27s+Salon+%7C+Park+View+City%2C+Rose+Commercial%2C+Lahore&t=&z=17&ie=UTF8&iwloc=&output=embed",
  },
  seo: {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://rbmakeover.com",
    title: "R.B Makeover Man's Salon | Park View City Lahore",
    description:
      "Men's haircuts, beard grooming and skincare in Park View City, Lahore. Rated 4.9 from 36 Google reviews at Rose Commercial, Main Boulevard.",
    keywords: [
      "men's salon park view city",
      "barbershop park view city lahore",
      "hair salon rose commercial lahore",
      "haircuts for men lahore",
      "beard trimming park view city",
      "r.b makeover mans salon",
      "skincare for men lahore",
    ],
  },
};
