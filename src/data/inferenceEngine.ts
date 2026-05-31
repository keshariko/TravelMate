// ============================================================
// TravelMate NLP Inference Engine
// Processes user input, detects intent, generates responses
// ============================================================

import { intents, travelPackages, type TravelPackage } from "./knowledgeBase";

export interface InferenceResult {
  intent: string;
  confidence: number;
  response: string;
  packages?: TravelPackage[];
  showPackageCards?: boolean;
}

// ============================================================
// TEXT PREPROCESSING (NLP Pipeline)
// ============================================================

/** Tokenize: split input into tokens */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1);
}

/** Stemming: reduce words to base form (simple rule-based) */
function stem(word: string): string {
  const stemRules: [RegExp, string][] = [
    [/ing$/, ""],
    [/tion$/, "te"],
    [/ations$/, "ate"],
    [/ational$/, "ate"],
    [/ness$/, ""],
    [/ful$/, ""],
    [/ous$/, ""],
    [/ive$/, ""],
    [/ers$/, "er"],
    [/ies$/, "y"],
    [/s$/, ""],
  ];
  let stemmed = word;
  for (const [pattern, replacement] of stemRules) {
    if (stemmed.length > 4 && pattern.test(stemmed)) {
      stemmed = stemmed.replace(pattern, replacement);
      break;
    }
  }
  return stemmed;
}

/** Remove stop words */
const stopWords = new Set([
  "a",
  "an",
  "the",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "have",
  "has",
  "had",
  "do",
  "does",
  "did",
  "will",
  "would",
  "could",
  "should",
  "may",
  "might",
  "shall",
  "to",
  "of",
  "in",
  "for",
  "on",
  "with",
  "at",
  "by",
  "from",
  "as",
  "into",
  "through",
  "and",
  "or",
  "but",
  "if",
  "then",
  "so",
  "that",
  "this",
  "it",
  "its",
  "i",
  "me",
  "my",
  "we",
  "our",
  "you",
  "your",
  "he",
  "she",
  "they",
  "them",
  "their",
  "what",
  "which",
  "who",
  "whom",
  "when",
  "where",
  "why",
  "how",
  "about",
  "want",
  "like",
  "can",
  "please",
  "tell",
  "show",
  "give",
  "me",
  "some",
  "any",
  "more",
  "get",
  "know",
  "find",
  "looking",
  "interested",
]);

function removeStopWords(tokens: string[]): string[] {
  return tokens.filter((t) => !stopWords.has(t));
}

/** Full preprocessing pipeline */
function preprocess(text: string): string[] {
  const tokens = tokenize(text);
  const filtered = removeStopWords(tokens);
  return filtered.map(stem);
}

// ============================================================
// PATTERN MATCHING ENGINE (TF-IDF inspired scoring)
// ============================================================

function computeScore(userTokens: string[], patterns: string[]): number {
  if (patterns.length === 0) return 0;

  const patternTokens = patterns.flatMap((p) => preprocess(p));
  const patternSet = new Set(patternTokens);

  let matchCount = 0;
  let exactMatchBonus = 0;

  for (const token of userTokens) {
    if (patternSet.has(token)) {
      matchCount++;
    }
    // Exact substring match in original patterns (higher weight)
    for (const pattern of patterns) {
      if (pattern.toLowerCase().includes(token)) {
        exactMatchBonus += 0.5;
        break;
      }
    }
  }

  const recall = matchCount / Math.max(patternSet.size, 1);
  const precision = (matchCount + exactMatchBonus) / Math.max(userTokens.length, 1);

  // F1-score style combination
  if (precision + recall === 0) return 0;
  return (2 * precision * recall) / (precision + recall);
}

// ============================================================
// INTENT CLASSIFICATION
// ============================================================

function classifyIntent(input: string): {
  intent: string;
  confidence: number;
} {
  const userTokens = preprocess(input);

  // Direct keyword matching for high-priority intents
  const inputLower = input.toLowerCase();

  // Check for direct keyword hits first (high confidence)
  const directMatches: Record<string, string[]> = {
    greeting: ["hello", "hi", "hey", "howdy"],
    beach: ["beach", "sea", "negombo", "coastal", "ocean"],
    hill: ["hill", "ella", "mountain", "highland", "trekking", "tea"],
    safari: ["safari", "yala", "wildlife", "leopard", "elephant", "jungle"],
    cultural: ["kandy", "sigiriya", "temple", "cultural", "cultural", "heritage", "ancient"],
    pricing: ["price", "cost", "how much", "rupees", "budget"],
    duration: ["how long", "days", "nights", "duration", "length"],
    booking: ["book", "reserve", "booking", "buy", "purchase"],
    contact: ["contact", "support", "phone", "email", "call"],
    goodbye: ["bye", "goodbye", "thanks", "thank you", "farewell"],
    all_packages: ["all packages", "show packages", "what packages", "what do you offer"],
    sri_lanka: ["sri lanka", "ceylon"],
    weather: ["weather", "climate", "season", "best time", "when to visit"],
  };

  for (const [intentName, keywords] of Object.entries(directMatches)) {
    for (const kw of keywords) {
      if (inputLower.includes(kw)) {
        return { intent: intentName, confidence: 0.95 };
      }
    }
  }

  // Fallback: pattern scoring
  let bestIntent = "unknown";
  let bestScore = 0;

  for (const intent of intents) {
    if (intent.name === "unknown") continue;
    const score = computeScore(userTokens, intent.patterns);
    if (score > bestScore) {
      bestScore = score;
      bestIntent = intent.name;
    }
  }

  if (bestScore < 0.1) {
    return { intent: "unknown", confidence: 1 };
  }

  return { intent: bestIntent, confidence: Math.min(bestScore, 1) };
}

// ============================================================
// RESPONSE GENERATION
// ============================================================

function pickResponse(responses: string[]): string {
  return responses[Math.floor(Math.random() * responses.length)];
}

function getPackagesForIntent(intentName: string): TravelPackage[] | undefined {
  const categoryMap: Record<string, TravelPackage["category"][]> = {
    beach: ["beach"],
    hill: ["hill"],
    safari: ["safari"],
    cultural: ["cultural", "heritage"],
    all_packages: ["beach", "hill", "safari", "cultural", "heritage"],
  };
  const cats = categoryMap[intentName];
  if (!cats) return undefined;
  return travelPackages.filter((p) => cats.includes(p.category));
}

// ============================================================
// MAIN INFERENCE FUNCTION
// ============================================================

export async function runInference(userInput: string): Promise<InferenceResult> {
  // Simulate processing delay (NLP pipeline)
  await new Promise((resolve) => setTimeout(resolve, 600 + Math.random() * 800));

  const trimmed = userInput.trim();
  if (!trimmed) {
    return {
      intent: "unknown",
      confidence: 1,
      response:
        "Please type a message and I'll be happy to help! 😊 Try asking about beach packages, safaris, or pricing.",
    };
  }

  const { intent, confidence } = classifyIntent(trimmed);

  const intentData = intents.find((i) => i.name === intent);
  const response = intentData
    ? pickResponse(intentData.responses)
    : "I'm not sure about that. Try asking about our travel packages or destinations! 🌍";

  const packages = getPackagesForIntent(intent);
  const showCards = [
    "beach",
    "hill",
    "safari",
    "cultural",
    "all_packages",
  ].includes(intent);

  return {
    intent,
    confidence,
    response,
    packages: packages?.slice(0, 3),
    showPackageCards: showCards,
  };
}
