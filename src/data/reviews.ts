export interface Review {
  id: string;
  author: string;
  rating: number;
  summary: string;
  source: "Google review";
}

export const reviewsSummary = {
  rating: 4.9,
  maxRating: 5.0,
  reviewCount: 36,
  sourceLabel: "Google reviews",
};

export const reviews: Review[] = [
  {
    id: "review-1",
    author: "Hamza Ch",
    rating: 5,
    summary:
      "Called the experience exceptional, praising the service, professionalism, atmosphere and welcoming staff.",
    source: "Google review",
  },
  {
    id: "review-2",
    author: "Azhar Abbas",
    rating: 5,
    summary:
      "Says it is one of the best salons in Park View and that he is always satisfied.",
    source: "Google review",
  },
  {
    id: "review-3",
    author: "Muhammad Bilal",
    rating: 5,
    summary: "Appreciated Ijaz Bhai's professional work.",
    source: "Google review",
  },
  {
    id: "review-4",
    author: "Ibrahim Arshad",
    rating: 5,
    summary: "Described Mr. Ejaz as a good hair cutter and a nice person.",
    source: "Google review",
  },
  {
    id: "review-5",
    author: "Haffi Naeem",
    rating: 5,
    summary: "Has had a good experience on every visit.",
    source: "Google review",
  },
  {
    id: "review-6",
    author: "Muhammad Safeer",
    rating: 5,
    summary:
      "Appreciated the kind, cooperative staff and the comfortable salon environment.",
    source: "Google review",
  },
  {
    id: "review-7",
    author: "Ali Chaudhary",
    rating: 5,
    summary: "Called it a superb place with a good environment.",
    source: "Google review",
  },
  {
    id: "review-8",
    author: "Abdullah Tariq",
    rating: 5,
    summary: "Praised the professional staff, especially Naveed Bhai.",
    source: "Google review",
  },
  {
    id: "review-9",
    author: "Ahsan Arbi",
    rating: 5,
    summary: "Appreciated the facial massage and the skincare products.",
    source: "Google review",
  },
];
