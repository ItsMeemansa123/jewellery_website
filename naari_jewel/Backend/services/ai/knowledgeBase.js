/**
 * Naari Jewels Knowledge Base for RAG (Policies, Care, Shipping, FAQs)
 */
const POLICIES = [
  {
    topic: "return_policy",
    title: "Return & Damage Replacement Policy",
    keywords: ["return", "exchange", "refund", "money back", "replace", "damaged", "broken", "defective", "lost"],
    content: `Naari Jewels follows a strict No-Return Policy once delivered, as our pieces are delicately handcrafted and quality checked. 
However, if a piece arrives DEFECTIVE, DAMAGED in transit, or is LOST during shipping, we provide an immediate 100% replacement or refund. 
To claim replacement for damaged goods, please share an unboxing video/photo with our support team within 24 hours of delivery.`,
  },
  {
    topic: "shipping_delivery",
    title: "Shipping & Delivery Policy",
    keywords: ["shipping", "delivery", "track", "courier", "charges", "how long", "cost", "speed", "dispatch", "dynamic"],
    content: `Shipping charges apply dynamically at checkout based on delivery pincode and location. 
Orders are typically dispatched within 24 hours. 
Metro deliveries usually take 2–3 business days, and other regions take 3–5 business days. 
Real-time tracking links are sent via SMS & Email as soon as your order is on the way.`,
  },
  {
    topic: "jewellery_care",
    title: "Jewellery Care & Maintenance",
    keywords: ["care", "clean", "maintain", "black", "tarnish", "water", "perfume", "wash", "silver"],
    content: `To keep your Naari Jewels pieces sparkling for years:
1. Avoid direct contact with perfumes, hairsprays, lotions, and harsh household chemicals.
2. Remove jewellery before showering, swimming, or working out.
3. Gently wipe with the complimentary soft microfiber polishing cloth after each wear.
4. Store each piece separately in the provided airtight anti-tarnish pouch to avoid scratches.`,
  },
  {
    topic: "authenticity_materials",
    title: "Authenticity & Material Quality",
    keywords: ["material", "silver", "gold", "pure", "hallmark", "hypoallergenic", "stone", "real"],
    content: `All Naari Jewels silver collections are crafted with authenticated 925 Sterling Silver, hallmarked for purity. 
Our gold-toned pieces feature 18K/24K micron plating designed to resist premature fading. 
All our jewellery is 100% hypoallergenic, nickel-free, and lead-free—safe for even sensitive skin.`,
  },
  {
    topic: "gifting_packaging",
    title: "Gifting & Signature Packaging",
    keywords: ["gift", "wrap", "box", "packaging", "sister", "mother", "birthday", "message", "note"],
    content: `Every Naari Jewels piece comes beautifully packaged in our signature luxury velvet box with an authenticity certificate. 
Complimentary handwritten personalized gift messages are available at checkout to make gifting truly memorable for birthdays, anniversaries, and festive celebrations.`,
  },
  {
    topic: "payment_options",
    title: "Payment Methods & Security",
    keywords: ["payment", "razorpay", "upi", "card", "emi", "cod", "safe", "secure", "gateway"],
    content: `We accept 100% secure payments powered by Razorpay, including UPI (Google Pay, PhonePe, Paytm), All Major Credit & Debit Cards (Visa, Mastercard, RuPay), NetBanking from 50+ banks, and Digital Wallets. All transactions are protected by 256-bit SSL encryption.`,
  },
];

/**
 * Searches policy knowledge base using semantic/keyword matching
 * @param {string} query
 * @returns {Array<{topic: string, title: string, content: string, relevanceScore: number}>}
 */
function searchKnowledgeBase(query) {
  if (!query || typeof query !== "string") return [];
  const lower = query.toLowerCase();
  const queryWords = lower.split(/\s+/).filter((w) => w.length > 2);

  const scored = POLICIES.map((doc) => {
    let score = 0;
    // Check keyword hits
    for (const kw of doc.keywords) {
      if (lower.includes(kw)) score += 3;
    }
    // Check word matches in title and content
    for (const word of queryWords) {
      if (doc.title.toLowerCase().includes(word)) score += 2;
      if (doc.content.toLowerCase().includes(word)) score += 1;
    }
    return { ...doc, score };
  });

  return scored
    .filter((doc) => doc.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

module.exports = {
  POLICIES,
  searchKnowledgeBase,
};
