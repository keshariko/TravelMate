// ============================================================
// TravelMate Knowledge Base / Database
// Stores all tourism data: packages, destinations, pricing
// ============================================================

export interface TravelPackage {
  id: string;
  name: string;
  destination: string;
  category: "beach" | "hill" | "safari" | "cultural" | "heritage";
  duration: string;
  price: number;
  currency: string;
  description: string;
  highlights: string[];
  rating: number;
  emoji: string;
  image: string; // gradient or color
  includes: string[];
}



// ============================================================
// TRAVEL PACKAGES DATABASE
// ============================================================
export const travelPackages: TravelPackage[] = [
  {
    id: "pkg-001",
    name: "Negombo Beach Escape",
    destination: "Negombo, Sri Lanka",
    category: "beach",
    duration: "3 Days / 2 Nights",
    price: 18500,
    currency: "LKR",
    description:
      "Experience the golden beaches, vibrant fishing culture, and serene backwaters of Negombo — a coastal paradise just 30km from Colombo.",
    highlights: [
      "Golden sandy beaches",
      "Sunrise boat tours",
      "Fresh seafood dining",
      "Dutch colonial heritage",
      "Hamilton Canal boat ride",
    ],
    rating: 4.7,
    emoji: "🌊",
    image: "from-cyan-400 to-blue-600",
    includes: ["Hotel (2N)", "Breakfast", "Airport Transfer", "Boat Tour"],
  },
  {
    id: "pkg-002",
    name: "Ella Hill Adventure",
    destination: "Ella, Sri Lanka",
    category: "hill",
    duration: "4 Days / 3 Nights",
    price: 24000,
    currency: "LKR",
    description:
      "Discover the mist-covered mountains, tea plantations, and breathtaking Nine Arch Bridge of Ella — nature's masterpiece in the highlands.",
    highlights: [
      "Nine Arch Bridge",
      "Little Adam's Peak hike",
      "Tea factory visit",
      "Scenic train ride",
      "Ravana Waterfalls",
    ],
    rating: 4.9,
    emoji: "⛰️",
    image: "from-emerald-400 to-green-700",
    includes: [
      "Hotel (3N)",
      "Breakfast",
      "Train Tickets",
      "Guided Hike",
      "Tea Tour",
    ],
  },
  {
    id: "pkg-003",
    name: "Yala Safari Tour",
    destination: "Yala National Park, Sri Lanka",
    category: "safari",
    duration: "3 Days / 2 Nights",
    price: 32000,
    currency: "LKR",
    description:
      "Embark on a thrilling wildlife safari in Yala — home to the world's highest density of leopards, elephants, and exotic bird species.",
    highlights: [
      "Leopard spotting",
      "Elephant encounters",
      "Crocodile watching",
      "Bird photography",
      "Sunrise game drive",
    ],
    rating: 4.8,
    emoji: "🦁",
    image: "from-amber-400 to-orange-600",
    includes: [
      "Lodge (2N)",
      "All Meals",
      "Safari Jeep",
      "Park Entry",
      "Naturalist Guide",
    ],
  },
  {
    id: "pkg-004",
    name: "Kandy Cultural Tour",
    destination: "Kandy, Sri Lanka",
    category: "cultural",
    duration: "3 Days / 2 Nights",
    price: 21000,
    currency: "LKR",
    description:
      "Immerse yourself in the rich cultural heritage of Kandy — the last royal capital of Sri Lanka, home to the sacred Temple of the Tooth.",
    highlights: [
      "Temple of the Tooth",
      "Kandy Lake walk",
      "Traditional dance show",
      "Royal Botanical Gardens",
      "Gem Museum",
    ],
    rating: 4.6,
    emoji: "🏛️",
    image: "from-purple-400 to-indigo-600",
    includes: [
      "Hotel (2N)",
      "Breakfast",
      "Cultural Show",
      "City Tour",
      "Museum Entry",
    ],
  },
  {
    id: "pkg-005",
    name: "Sigiriya Heritage Trip",
    destination: "Sigiriya, Sri Lanka",
    category: "heritage",
    duration: "2 Days / 1 Night",
    price: 15000,
    currency: "LKR",
    description:
      "Climb the legendary Lion Rock fortress of Sigiriya — an ancient marvel rising 200m above the jungle, a UNESCO World Heritage Site.",
    highlights: [
      "Sigiriya Rock Fortress",
      "Ancient frescoes",
      "Water gardens",
      "Dambulla Cave Temple",
      "Village safari",
    ],
    rating: 4.9,
    emoji: "🏔️",
    image: "from-rose-400 to-red-600",
    includes: [
      "Hotel (1N)",
      "Breakfast",
      "Fortress Entry",
      "Cave Temple",
      "Village Tour",
    ],
  },
  {
    id: "pkg-006",
    name: "Colombo City Explorer",
    destination: "Colombo, Sri Lanka",
    category: "cultural",
    duration: "2 Days / 1 Night",
    price: 12500,
    currency: "LKR",
    description:
      "Discover the vibrant cosmopolitan capital — modern skyscrapers beside colonial architecture, street food, and bustling local markets.",
    highlights: [
      "Gangaramaya Temple",
      "Pettah Market",
      "Galle Face Green",
      "National Museum",
      "Colombo Fort",
    ],
    rating: 4.4,
    emoji: "🌆",
    image: "from-sky-400 to-blue-700",
    includes: ["Hotel (1N)", "Breakfast", "City Tour Bus", "Museum Entry"],
  },
];



export const quickReplies = [
  { label: "🌊 Beach Packages", query: "Show me beach packages" },
  { label: "⛰️ Hill Country", query: "Tell me about hill packages" },
  { label: "🦁 Safari Tours", query: "Show safari tour options" },
  { label: "🏛️ Cultural Tours", query: "What cultural tours do you have?" },
  { label: "💰 View Prices", query: "How much do packages cost?" },
  { label: "📦 All Packages", query: "Show all available packages" },
];
