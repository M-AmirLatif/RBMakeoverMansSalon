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
      { id: "debit-card-machine", name: "Debit card and machine", iconName: "CreditCard" },
      { id: "online-cash", name: "Online cash", iconName: "Smartphone" },
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
