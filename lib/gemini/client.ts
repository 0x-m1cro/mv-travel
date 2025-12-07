import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

if (!GEMINI_API_KEY) {
  console.warn("GEMINI_API_KEY is not set. AI/Vibe search will not work.");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export interface VibeSearchResult {
  searchTerms: string[];
  amenities: string[];
  tags: string[];
  priceRange?: [number, number];
  starRating?: number[];
}

/**
 * Process a vibe search query using Gemini AI
 * Example: "romantic overwater villas with private pool" -> structured search params
 */
export async function processVibeSearch(query: string): Promise<VibeSearchResult> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `You are a Maldives hotel search assistant. Analyze the following hotel search query and extract structured search parameters.

Query: "${query}"

Extract the following information as JSON:
- searchTerms: Array of key search terms (e.g., ["overwater", "villa", "romantic"])
- amenities: Array of amenities mentioned (e.g., ["private pool", "spa", "water sports"])
- tags: Array of relevant tags (e.g., ["honeymoon", "luxury", "all-inclusive"])
- priceRange: Optional [min, max] in USD per night (only if mentioned)
- starRating: Optional array of star ratings (only if mentioned, e.g., [4, 5] for 4-5 star)

Guidelines:
- For "luxury" or "high-end", suggest starRating: [4, 5]
- For "budget" or "affordable", suggest priceRange: [0, 500]
- Common Maldives amenities: "overwater villa", "private pool", "spa", "water sports", "diving", "snorkeling", "all-inclusive", "private island"
- Common tags: "honeymoon", "family-friendly", "adults-only", "all-inclusive", "water villa", "beach villa", "private island"

Respond ONLY with valid JSON, no additional text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse AI response");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      searchTerms: parsed.searchTerms || [],
      amenities: parsed.amenities || [],
      tags: parsed.tags || [],
      priceRange: parsed.priceRange,
      starRating: parsed.starRating,
    };
  } catch (error) {
    console.error("Error processing vibe search:", error);
    
    // Fallback: Simple keyword extraction
    const lowerQuery = query.toLowerCase();
    const fallback: VibeSearchResult = {
      searchTerms: query.split(" ").filter(w => w.length > 3),
      amenities: [],
      tags: [],
    };

    // Extract common keywords
    if (lowerQuery.includes("romantic") || lowerQuery.includes("honeymoon")) {
      fallback.tags.push("honeymoon", "romantic");
    }
    if (lowerQuery.includes("luxury") || lowerQuery.includes("5 star")) {
      fallback.starRating = [4, 5];
    }
    if (lowerQuery.includes("overwater") || lowerQuery.includes("water villa")) {
      fallback.amenities.push("overwater villa");
    }
    if (lowerQuery.includes("private pool")) {
      fallback.amenities.push("private pool");
    }
    if (lowerQuery.includes("all-inclusive") || lowerQuery.includes("all inclusive")) {
      fallback.tags.push("all-inclusive");
    }

    return fallback;
  }
}

/**
 * Generate hotel persona tags using AI
 */
export async function generateHotelPersonaTags(
  hotelName: string,
  description: string,
  amenities: string[]
): Promise<string[]> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Analyze this Maldives hotel and suggest 3-5 persona tags that describe its vibe and ideal guest.

Hotel: ${hotelName}
Description: ${description}
Amenities: ${amenities.join(", ")}

Suggest tags from: romantic, family-friendly, adventure, wellness, luxury, eco-friendly, diving, water-sports, private, exclusive, budget-friendly, all-inclusive, adults-only, honeymoon

Respond with ONLY a JSON array of 3-5 tags, no additional text.
Example: ["romantic", "luxury", "honeymoon"]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse JSON array
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return [];
  } catch (error) {
    console.error("Error generating hotel persona tags:", error);
    return [];
  }
}
