export interface AmenityItem {
  id: string;
  name: string;
  iconName: string;
}

export interface AmenityCategory {
  id: string;
  title: string;
  items: AmenityItem[];
}

export const amenityCategories: AmenityCategory[] = [
  {
    id: "comfort",
    title: "Comfort",
    items: [
      { id: "wifi", name: "Free Wi-Fi", iconName: "Wifi" },
      { id: "restroom", name: "Restroom", iconName: "Bath" },
      { id: "gender-neutral-restroom", name: "Gender-neutral restroom", iconName: "DoorClosed" },
    ],
  },
  {
    id: "parking",
    title: "Parking",
    items: [
      { id: "free-parking-lot", name: "Free parking lot", iconName: "Car" },
      { id: "free-street-parking", name: "Free street parking", iconName: "Compass" },
      { id: "on-site-parking", name: "On-site parking", iconName: "Car" },
    ],
  },
  {
    id: "payments",
    title: "Payments",
    items: [
      { id: "cards", name: "Credit and debit cards", iconName: "CreditCard" },
      { id: "nfc", name: "NFC mobile payments", iconName: "Smartphone" },
    ],
  },
  {
    id: "accessibility",
    title: "Accessibility",
    items: [
      { id: "wheelchair-entrance", name: "Wheelchair-accessible entrance", iconName: "Accessibility" },
      { id: "wheelchair-parking", name: "Wheelchair-accessible parking", iconName: "Car" },
      { id: "wheelchair-restroom", name: "Wheelchair-accessible restroom", iconName: "CheckCircle2" },
    ],
  },
  {
    id: "family",
    title: "Family",
    items: [
      { id: "children", name: "Suitable for children", iconName: "Smile" },
    ],
  },
];
