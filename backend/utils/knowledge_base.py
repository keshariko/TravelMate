# ============================================================
# TravelMate Knowledge Base / Database (Python Mirror)
# Matches frontend src/data/knowledgeBase.ts
# ============================================================

travel_packages = [
    {
        "id": "pkg-001",
        "name": "Negombo Beach Escape",
        "destination": "Negombo, Sri Lanka",
        "category": "beach",
        "duration": "3 Days / 2 Nights",
        "price": 18500,
        "currency": "LKR",
        "description": "Experience the golden beaches, vibrant fishing culture, and serene backwaters of Negombo — a coastal paradise just 30km from Colombo.",
        "highlights": [
            "Golden sandy beaches",
            "Sunrise boat tours",
            "Fresh seafood dining",
            "Dutch colonial heritage",
            "Hamilton Canal boat ride"
        ],
        "rating": 4.7,
        "emoji": "🌊",
        "image": "from-cyan-400 to-blue-600",
        "includes": ["Hotel (2N)", "Breakfast", "Airport Transfer", "Boat Tour"]
    },
    {
        "id": "pkg-002",
        "name": "Ella Hill Adventure",
        "destination": "Ella, Sri Lanka",
        "category": "hill",
        "duration": "4 Days / 3 Nights",
        "price": 24000,
        "currency": "LKR",
        "description": "Discover the mist-covered mountains, tea plantations, and breathtaking Nine Arch Bridge of Ella — nature's masterpiece in the highlands.",
        "highlights": [
            "Nine Arch Bridge",
            "Little Adam's Peak hike",
            "Tea factory visit",
            "Scenic train ride",
            "Ravana Waterfalls"
        ],
        "rating": 4.9,
        "emoji": "⛰️",
        "image": "from-emerald-400 to-green-700",
        "includes": ["Hotel (3N)", "Breakfast", "Train Tickets", "Guided Hike", "Tea Tour"]
    },
    {
        "id": "pkg-003",
        "name": "Yala Safari Tour",
        "destination": "Yala National Park, Sri Lanka",
        "category": "safari",
        "duration": "3 Days / 2 Nights",
        "price": 32000,
        "currency": "LKR",
        "description": "Embark on a thrilling wildlife safari in Yala — home to the world's highest density of leopards, elephants, and exotic bird species.",
        "highlights": [
            "Leopard spotting",
            "Elephant encounters",
            "Crocodile watching",
            "Bird photography",
            "Sunrise game drive"
        ],
        "rating": 4.8,
        "emoji": "🦁",
        "image": "from-amber-400 to-orange-600",
        "includes": ["Lodge (2N)", "All Meals", "Safari Jeep", "Park Entry", "Naturalist Guide"]
    },
    {
        "id": "pkg-004",
        "name": "Kandy Cultural Tour",
        "destination": "Kandy, Sri Lanka",
        "category": "cultural",
        "duration": "3 Days / 2 Nights",
        "price": 21000,
        "currency": "LKR",
        "description": "Immerse yourself in the rich cultural heritage of Kandy — the last royal capital of Sri Lanka, home to the sacred Temple of the Tooth.",
        "highlights": [
            "Temple of the Tooth",
            "Kandy Lake walk",
            "Traditional dance show",
            "Royal Botanical Gardens",
            "Gem Museum"
        ],
        "rating": 4.6,
        "emoji": "🏛️",
        "image": "from-purple-400 to-indigo-600",
        "includes": ["Hotel (2N)", "Breakfast", "Cultural Show", "City Tour", "Museum Entry"]
    },
    {
        "id": "pkg-005",
        "name": "Sigiriya Heritage Trip",
        "destination": "Sigiriya, Sri Lanka",
        "category": "heritage",
        "duration": "2 Days / 1 Night",
        "price": 15000,
        "currency": "LKR",
        "description": "Climb the legendary Lion Rock fortress of Sigiriya — an ancient marvel rising 200m above the jungle, a UNESCO World Heritage Site.",
        "highlights": [
            "Sigiriya Rock Fortress",
            "Ancient frescoes",
            "Water gardens",
            "Dambulla Cave Temple",
            "Village safari"
        ],
        "rating": 4.9,
        "emoji": "🏔️",
        "image": "from-rose-400 to-red-600",
        "includes": ["Hotel (1N)", "Breakfast", "Fortress Entry", "Cave Temple", "Village Tour"]
    },
    {
        "id": "pkg-006",
        "name": "Colombo City Explorer",
        "destination": "Colombo, Sri Lanka",
        "category": "cultural",
        "duration": "2 Days / 1 Night",
        "price": 12500,
        "currency": "LKR",
        "description": "Discover the vibrant cosmopolitan capital — modern skyscrapers beside colonial architecture, street food, and bustling local markets.",
        "highlights": [
            "Gangaramaya Temple",
            "Pettah Market",
            "Galle Face Green",
            "National Museum",
            "Colombo Fort"
        ],
        "rating": 4.4,
        "emoji": "🌆",
        "image": "from-sky-400 to-blue-700",
        "includes": ["Hotel (1N)", "Breakfast", "City Tour Bus", "Museum Entry"]
    }
]

intents_responses = {
    "greeting": [
        "Hello! Welcome to TravelMate 😊 I'm your AI travel assistant. How can I help plan your next Sri Lankan adventure?",
        "Hi there! 🌍 I'm TravelMate, your smart travel guide. Ready to explore Sri Lanka's wonders?",
        "Hey! Welcome aboard TravelMate ✈️ Ask me about beach getaways, hill adventures, safaris, or cultural tours!"
    ],
    "beach": [
        "We recommend our **Negombo Beach Escape** package 🌊 — 3 days of golden beaches, sunrise boat tours, and fresh seafood. Starting from **Rs. 18,500**!",
        "Perfect choice for beach lovers! 🏖️ Our **Negombo Beach Escape** offers pristine sandy shores, Dutch canal boat rides, and vibrant fishing culture for just **Rs. 18,500** (3D/2N)."
    ],
    "hill": [
        "Our **Ella Hill Adventure** package is perfect for nature lovers ⛰️ — 4 days exploring the Nine Arch Bridge, tea plantations, and misty mountains. Starting from **Rs. 24,000**!",
        "Love the hills? 🌿 The **Ella Hill Adventure** offers a scenic train ride, Little Adam's Peak hike, and a tea factory tour — all for **Rs. 24,000** (4D/3N)."
    ],
    "safari": [
        "You can explore amazing wildlife with our **Yala Safari Tour** 🦁 — spot leopards, elephants, and exotic birds in Yala National Park. Starting from **Rs. 32,000** (3D/2N)!",
        "Adventure awaits! 🐘 Our **Yala Safari Tour** takes you deep into Sri Lanka's wild heart — sunrise game drives, leopard spotting, and luxury lodge stays from **Rs. 32,000**."
    ],
    "cultural": [
        "Explore Sri Lanka's rich history! 🏛️ Our **Kandy Cultural Tour** includes the sacred Temple of the Tooth, traditional dance shows, and Royal Botanical Gardens — from **Rs. 21,000** (3D/2N).",
        "For heritage lovers, we offer the **Sigiriya Heritage Trip** 🏔️ — climb the legendary Lion Rock, see ancient frescoes, and visit Dambulla Cave Temple. From **Rs. 15,000** (2D/1N)!"
    ],
    "pricing": [
        "Our travel packages start from **Rs. 12,500** 💰 Here's a quick overview:\n\n• 🌊 Negombo Beach — Rs. 18,500\n• ⛰️ Ella Hill — Rs. 24,000\n• 🦁 Yala Safari — Rs. 32,000\n• 🏛️ Kandy Cultural — Rs. 21,000\n• 🏔️ Sigiriya Heritage — Rs. 15,000\n• 🌆 Colombo City — Rs. 12,500",
        "Great question about pricing! 💰 All packages include accommodation, meals, and guided tours. Prices range from **Rs. 12,500 to Rs. 32,000** depending on duration and activities. Which package interests you?"
    ],
    "duration": [
        "Package durations vary ⏱️:\n\n• 🌆 Colombo City — 2 Days / 1 Night\n• 🏔️ Sigiriya Heritage — 2 Days / 1 Night\n• 🌊 Negombo Beach — 3 Days / 2 Nights\n• 🦁 Yala Safari — 3 Days / 2 Nights\n• 🏛️ Kandy Cultural — 3 Days / 2 Nights\n• ⛰️ Ella Hill — 4 Days / 3 Nights",
        "Trip lengths range from weekend getaways (2 days) to extended adventures (4 days) ⏰ We can also customize packages to fit your schedule!"
    ],
    "all_packages": [
        "Here are all our **TravelMate packages** 🗺️:\n\n1. 🌊 **Negombo Beach Escape** — Rs. 18,500 (3D/2N)\n2. ⛰️ **Ella Hill Adventure** — Rs. 24,000 (4D/3N)\n3. 🦁 **Yala Safari Tour** — Rs. 32,000 (3D/2N)\n4. 🏛️ **Kandy Cultural Tour** — Rs. 21,000 (3D/2N)\n5. 🏔️ **Sigiriya Heritage Trip** — Rs. 15,000 (2D/1N)\n6. 🌆 **Colombo City Explorer** — Rs. 12,500 (2D/1N)\n\nWhich one would you like to know more about?"
    ],
    "booking": [
        "Ready to book? 🎉 You can reserve your package by:\n\n📞 **Call us**: +94 11 234 5678\n📧 **Email**: bookings@travelmate.lk\n🌐 **Online**: Fill out the form at our website\n\nOur travel experts are available 24/7 to assist you!",
        "Wonderful choice! ✈️ To complete your booking, please contact us:\n\n📞 +94 11 234 5678\n📧 bookings@travelmate.lk\n\nWe'll arrange everything — visa support, transfers, and accommodation!"
    ],
    "sri_lanka": [
        "Sri Lanka 🌴 — the Pearl of the Indian Ocean! A tropical paradise with:\n\n✨ 8 UNESCO World Heritage Sites\n🏖️ 1,340km of pristine coastline\n🐘 Rich wildlife including elephants & leopards\n🍵 World-famous Ceylon tea\n🏛️ 2,500 years of history & culture\n\nWhich part would you like to explore?"
    ],
    "weather": [
        "Sri Lanka's climate is tropical 🌤️:\n\n☀️ **Best time to visit West/South Coast**: December – March\n🌿 **Best time to visit East Coast**: May – September\n⛰️ **Hill Country**: Year-round (pack layers!)\n🦁 **Yala Safari**: February – July (dry season)\n\nWhen are you planning to travel?"
    ],
    "contact": [
        "Our support team is here 24/7! 📞\n\n📞 **Phone**: +94 11 234 5678\n📧 **Email**: support@travelmate.lk\n💬 **WhatsApp**: +94 77 123 4567\n📍 **Office**: No. 45, Galle Road, Colombo 03\n\nWe're happy to help plan your perfect trip!"
    ],
    "goodbye": [
        "Thank you for using TravelMate! Safe travels ✈️ Come back anytime for your next adventure. Bon Voyage! 🌍",
        "Goodbye! 😊 It was a pleasure helping you plan your journey. Wishing you amazing travels ahead! ✈️🌴",
        "Safe travels! 🌟 Remember — TravelMate is always here to plan your next perfect trip. See you soon!"
    ],
    "about": [
        "I am **TravelMate AI** 🤖, a smart travel recommendation assistant designed for Sri Lanka tourism. I use machine learning to understand your questions and help you discover customized tour packages (such as beach, hill country, safari, and cultural tours).",
        "TravelMate AI is a final year university research project designed to demonstrate machine learning-powered intent classification for travel planning. Ask me about travel packages, prices, weather, or destinations in Sri Lanka! 🌍✈️",
        "This chatbot is **TravelMate AI**, your intelligent guide to exploring Sri Lanka. I can analyze your preferences and suggest vacation packages, safari trips, cultural landmarks, and pricing details. How can I help you today? 😊"
    ],
    "unknown": [
        "I'm not sure I understood that 🤔 Could you try rephrasing? You can ask me about:\n\n🌊 **Beach packages**\n⛰️ **Hill country trips**\n🦁 **Safari tours**\n🏛️ **Cultural experiences**\n💰 **Pricing & duration**",
        "Hmm, I didn't quite catch that 😊 Try asking about our travel packages, pricing, best destinations, or contact details!"
    ]
}
