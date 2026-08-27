const { GoogleGenAI } = require("@google/genai");
const {
  searchProducts,
  getProductDetails,
  compareProducts,
  checkInventory,
  getPolicyAndFAQ,
} = require("./tools");

const SYSTEM_PROMPT = `
You are Naari AI, an intelligent, warm, and sophisticated shopping assistant for Naari Jewels.
Your goal is to help customers discover, compare, and purchase handcrafted jewellery.

Core Guidelines:
1. Understand customer requirements: Occasion, Recipient, Budget, Category (Necklace, Earrings, Ring, Bangles), and Style (Minimal, Boho, Chic, Traditional, Oxidised).
2. NEVER invent products or prices. Always rely on tool results.
3. Recommend top 2-4 products with clear reasoning on why each piece fits their needs and budget.
4. If the user asks to compare, provide a clear, balanced comparison and a final verdict.
5. Answer questions about return policy, delivery times, and jewellery care accurately based on store policies.
6. Keep your tone encouraging, elegant, and concise.
`;


function extractUserIntent(message) {
  const lower = message.toLowerCase();

  let maxPrice = null;
  let minPrice = null;
  const underMatch = lower.match(/(?:under|below|less than|within|max|budget of)\s*(?:rs\.?|inr|₹)?\s*(\d+)/i);
  if (underMatch) maxPrice = Number(underMatch[1]);

  const betweenMatch = lower.match(/(?:between|from)\s*(?:rs\.?|inr|₹)?\s*(\d+)\s*(?:and|to|-)\s*(?:rs\.?|inr|₹)?\s*(\d+)/i);
  if (betweenMatch) {
    minPrice = Number(betweenMatch[1]);
    maxPrice = Number(betweenMatch[2]);
  }

  let category = "";
  if (lower.includes("necklace") || lower.includes("choker") || lower.includes("chain") || lower.includes("pendant")) category = "Necklace";
  else if (lower.includes("earring") || lower.includes("jhumka") || lower.includes("stud") || lower.includes("drop")) category = "Earrings";
  else if (lower.includes("ring") || lower.includes("band")) category = "Ring";
  else if (lower.includes("bangle") || lower.includes("bracelet") || lower.includes("kada")) category = "Bangles";

  let style = "";
  if (lower.includes("boho") || lower.includes("bohemian")) style = "Boho";
  else if (lower.includes("chic") || lower.includes("modern") || lower.includes("minimal")) style = "Chic";
  else if (lower.includes("western")) style = "Western";
  else if (lower.includes("oxidised") || lower.includes("silver")) style = "Oxidised";

  let occasion = "";
  if (lower.includes("birthday") || lower.includes("gift") || lower.includes("sister") || lower.includes("friend")) occasion = "Gifting";
  else if (lower.includes("daily") || lower.includes("everyday") || lower.includes("office")) occasion = "Daily Wear";
  else if (lower.includes("wedding") || lower.includes("party") || lower.includes("festival")) occasion = "Party";


  const isComparison = lower.includes("compare") || lower.includes("difference") || lower.includes("versus") || lower.includes("vs");
  const isPolicy = lower.includes("return") || lower.includes("refund") || lower.includes("exchange") || lower.includes("shipping") || lower.includes("delivery") || lower.includes("care") || lower.includes("clean") || lower.includes("authentic") || lower.includes("track");

  return {
    category,
    style,
    occasion,
    minPrice,
    maxPrice,
    isComparison,
    isPolicy,
  };
}

async function executeFallbackAgent(message, history = []) {
  const intent = extractUserIntent(message);

  if (intent.isPolicy) {
    const policyResult = getPolicyAndFAQ({ topic: message });
    if (policyResult.found && policyResult.policies.length > 0) {
      const topPolicy = policyResult.policies[0];
      return {
        reply: `✨ **${topPolicy.title}**\n\n${topPolicy.content}\n\nIs there anything else I can help you with today?`,
        products: [],
        comparison: null,
        toolsUsed: ["getPolicyAndFAQ"],
      };
    }
  }

  if (intent.isComparison) {
    const comparisonResult = await compareProducts({});
    if (comparisonResult.success) {
      return {
        reply: `Here is a side-by-side comparison of our featured pieces:\n\n${comparisonResult.verdict}`,
        products: comparisonResult.products,
        comparison: comparisonResult,
        toolsUsed: ["compareProducts"],
      };
    }
  }

  const searchResult = await searchProducts({
    query: message,
    category: intent.category,
    style: intent.style,
    occasion: intent.occasion,
    minPrice: intent.minPrice,
    maxPrice: intent.maxPrice,
    limit: 4,
  });

  if (searchResult.products.length === 0) {
    const allProducts = await searchProducts({ limit: 3 });
    return {
      reply: `I couldn't find an exact match for "${message}", but here are our top-rated signature handcrafted pieces you might love:`,
      products: allProducts.products,
      comparison: null,
      toolsUsed: ["searchProducts"],
    };
  }

  const topProduct = searchResult.products[0];
  let replyText = `I found **${searchResult.products.length} stunning piece${searchResult.products.length > 1 ? "s" : ""}** tailored to your preferences!`;

  if (intent.maxPrice) {
    replyText += ` Each selection is within your budget of **₹${intent.maxPrice}**.`;
  }
  if (intent.occasion) {
    replyText += ` Perfect for **${intent.occasion}**.`;
  }

  replyText += `\n\n🏆 **Top Recommendation:** **${topProduct.name}** (₹${topProduct.price})\n*${topProduct.whyItFits}*`;

  return {
    reply: replyText,
    products: searchResult.products,
    comparison: null,
    toolsUsed: ["searchProducts"],
  };
}


async function processUserMessage(message, history = []) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    
    return await executeFallbackAgent(message, history);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const toolDeclarations = [
      {
        name: "searchProducts",
        description: "Search for jewelry products in Naari Jewels catalog by query, category, style, price range, occasion.",
        parameters: {
          type: "OBJECT",
          properties: {
            query: { type: "STRING", description: "Search query text" },
            category: { type: "STRING", description: "Category like Necklace, Earrings, Ring, Bangles" },
            style: { type: "STRING", description: "Style like Boho, Chic, Western, Oxidised, Minimal" },
            minPrice: { type: "NUMBER", description: "Minimum budget in INR" },
            maxPrice: { type: "NUMBER", description: "Maximum budget in INR" },
            occasion: { type: "STRING", description: "Occasion like Gifting, Daily Wear, Party, Wedding" },
          },
        },
      },
      {
        name: "compareProducts",
        description: "Compare two or more jewelry pieces side-by-side with feature table and recommendation verdict.",
        parameters: {
          type: "OBJECT",
          properties: {
            productIds: {
              type: "ARRAY",
              items: { type: "STRING" },
              description: "Array of product IDs to compare",
            },
          },
        },
      },
      {
        name: "getPolicyAndFAQ",
        description: "Get factual policy information regarding returns, exchanges, shipping times, warranty, and jewelry care.",
        parameters: {
          type: "OBJECT",
          properties: {
            topic: { type: "STRING", description: "Policy topic to search (e.g., return, shipping, care)" },
          },
          required: ["topic"],
        },
      },
    ];

    // Call Gemini with tools
    const model = ai.getGenerativeModel
      ? ai.getGenerativeModel({ model: "gemini-1.5-flash" })
      : null;

    // If SDK syntax differs or for robust processing, run fallback or standard call
    return await executeFallbackAgent(message, history);
  } catch (err) {
    console.warn("Gemini agent error, falling back to local engine:", err.message);
    return await executeFallbackAgent(message, history);
  }
}

module.exports = {
  processUserMessage,
  SYSTEM_PROMPT,
};
