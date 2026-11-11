export interface BarberServiceRate {
  haircut: number;
  beard: number;
  hairAndBeard: number;
  facial: number;
  groomingPackage: number;
}

export interface BarberStaff {
  id: string;
  name: string;
  title: string;
  category: "all" | "senior" | "haircut" | "skincare";
  initials: string;
  experience: string;
  rating: number;
  reviewCount: number;
  specialties: string[];
  bio: string;
  rates: BarberServiceRate;
  isPopular?: boolean;
}

export const staffBarbers: BarberStaff[] = [
  {
    id: "imtiaz-ahmad",
    name: "Imtiaz Ahmad",
    title: "Head Stylist & Salon Owner",
    category: "senior",
    initials: "IA",
    experience: "14+ Years",
    rating: 5.0,
    reviewCount: 24,
    specialties: ["Executive Haircuts", "VIP Styling", "Signature Consultation"],
    bio: "Owner of R.B Makeover. Known for attentive consultations, executive styling, and high salon standards.",
    rates: {
      haircut: 1500,
      beard: 800,
      hairAndBeard: 2000,
      facial: 2500,
      groomingPackage: 4500,
    },
    isPopular: true,
  },
  {
    id: "asfand-imtiaz",
    name: "Asfand Imtiaz",
    title: "Senior Director & Master Barber",
    category: "senior",
    initials: "AI",
    experience: "10 Years",
    rating: 5.0,
    reviewCount: 21,
    specialties: ["Modern Fades", "Texture Cuts", "Precision Grooming"],
    bio: "Storefront partner noted for modern skin fades, textured scissor cuts, and customer satisfaction.",
    rates: {
      haircut: 1400,
      beard: 700,
      hairAndBeard: 1900,
      facial: 2200,
      groomingPackage: 4200,
    },
    isPopular: true,
  },
  {
    id: "ijaz-bhai",
    name: "Ijaz / Ejaz Bhai",
    title: "Senior Hair Stylist",
    category: "haircut",
    initials: "IB",
    experience: "9 Years",
    rating: 5.0,
    reviewCount: 19,
    specialties: ["Custom Scissor Cuts", "Classic Haircuts", "Beard Shaping"],
    bio: "Named by Muhammad Bilal and Ibrahim Arshad in Google reviews for exceptional haircutting precision.",
    rates: {
      haircut: 1200,
      beard: 600,
      hairAndBeard: 1600,
      facial: 2000,
      groomingPackage: 3800,
    },
    isPopular: true,
  },
  {
    id: "naveed-bhai",
    name: "Naveed Bhai",
    title: "Senior Barber & Stylist",
    category: "haircut",
    initials: "NB",
    experience: "8 Years",
    rating: 4.9,
    reviewCount: 16,
    specialties: ["Sharp Beard Lineup", "Fade Haircuts", "Professional Shave"],
    bio: "Praised by Abdullah Tariq in Google reviews for his friendly demeanor and sharp beard grooming.",
    rates: {
      haircut: 1000,
      beard: 600,
      hairAndBeard: 1500,
      facial: 1800,
      groomingPackage: 3500,
    },
  },
  {
    id: "hamza-khan",
    name: "Hamza Khan",
    title: "Hair & Beard Stylist",
    category: "haircut",
    initials: "HK",
    experience: "6 Years",
    rating: 4.9,
    reviewCount: 12,
    specialties: ["Skin Fades", "Taper Cuts", "Curly Hair Styling"],
    bio: "Expert in contemporary low, mid, and high fades as well as tailored curly hair styling.",
    rates: {
      haircut: 900,
      beard: 500,
      hairAndBeard: 1300,
      facial: 1600,
      groomingPackage: 3000,
    },
  },
  {
    id: "muhammad-bilal",
    name: "Muhammad Bilal",
    title: "Barber & Shaving Specialist",
    category: "haircut",
    initials: "MB",
    experience: "7 Years",
    rating: 4.9,
    reviewCount: 15,
    specialties: ["Clean Shave", "Beard Dyeing", "Head Massage"],
    bio: "Specializes in traditional straight line shaves, beard conditioning, and therapeutic head massage.",
    rates: {
      haircut: 900,
      beard: 500,
      hairAndBeard: 1300,
      facial: 1600,
      groomingPackage: 3000,
    },
  },
  {
    id: "ali-raza",
    name: "Ali Raza",
    title: "Skincare & Facial Specialist",
    category: "skincare",
    initials: "AR",
    experience: "6 Years",
    rating: 5.0,
    reviewCount: 14,
    specialties: ["Facial Massage", "Deep Pore Cleansing", "Skin Glow Masks"],
    bio: "Recognized for relaxing facial treatments, blackhead cleansing, and skin hydration therapies.",
    rates: {
      haircut: 800,
      beard: 500,
      hairAndBeard: 1200,
      facial: 2000,
      groomingPackage: 3200,
    },
  },
  {
    id: "usman-tariq",
    name: "Usman Tariq",
    title: "Hair Color & Straightening Specialist",
    category: "haircut",
    initials: "UT",
    experience: "7 Years",
    rating: 4.8,
    reviewCount: 11,
    specialties: ["Hair Coloring", "Hair Straightening", "Keratin Treatment"],
    bio: "Specializes in natural hair color tones, smoothing keratin treatments, and hair care repair.",
    rates: {
      haircut: 1000,
      beard: 500,
      hairAndBeard: 1400,
      facial: 1800,
      groomingPackage: 3500,
    },
  },
  {
    id: "farhan-ahmad",
    name: "Farhan Ahmad",
    title: "Junior Stylist & Barber",
    category: "haircut",
    initials: "FA",
    experience: "4 Years",
    rating: 4.9,
    reviewCount: 9,
    specialties: ["Classic Haircuts", "Kids' Haircuts", "Simple Beard Trim"],
    bio: "Patient and gentle with boys and kids, providing fast and reliable everyday haircuts.",
    rates: {
      haircut: 700,
      beard: 400,
      hairAndBeard: 1000,
      facial: 1400,
      groomingPackage: 2600,
    },
  },
  {
    id: "rashid-mehmood",
    name: "Rashid Mehmood",
    title: "Grooming & Scalp Care Technician",
    category: "skincare",
    initials: "RM",
    experience: "5 Years",
    rating: 4.9,
    reviewCount: 10,
    specialties: ["Scalp Washing", "Shampoo & Conditioning", "Hand Grooming"],
    bio: "Provides therapeutic scalp washing, intensive conditioning, and complete grooming care.",
    rates: {
      haircut: 800,
      beard: 450,
      hairAndBeard: 1150,
      facial: 1500,
      groomingPackage: 2800,
    },
  },
];

export const teamMembers = staffBarbers;

export const teamInfo = {
  headline: "Salon Staff & Barbers",
  sharedFeedback:
    "Customers appreciate our cooperative staff and comfortable salon environment. Select your preferred barber below.",
  ownerStatement:
    "Owner Imtiaz Ahmad built R.B Makeover around giving Park View City the best service, backed by our team of 10 experienced barbers.",
};
