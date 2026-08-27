import { useState, useEffect, useRef } from "react";
import axios from "axios";
import AIChatMessage from "../components/AIChatMessage";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { API_BASE_URL } from "../services/api";

function AIShopping() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([
    { label: "🎁 Birthday gift under ₹2000 for my sister", prompt: "Birthday gift under ₹2000 for my sister" },
    { label: "✨ Minimal earrings under ₹2500 for daily wear", prompt: "Minimal earrings under ₹2500 for daily wear" },
    { label: "💎 Elegant necklace between ₹2000-5000", prompt: "Elegant necklace between ₹2000 and 5000" },
    { label: "⚖️ Compare top necklaces", prompt: "Compare top 2 necklaces side by side" },
    { label: "📦 What is your damage replacement & shipping policy?", prompt: "What is your transit damage replacement and shipping policy?" },
  ]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const apiUrl = API_BASE_URL;

  // Initial welcome message
  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content: `👋 **Welcome to Naari AI!**\n\nTell me what you're looking for, your budget, the occasion, or style preference—and I'll find the best handcrafted pieces for you.`,
        products: [],
        toolsUsed: [],
      },
    ]);

    // Fetch dynamic suggestions if available
    axios
      .get(`${apiUrl}/api/ai/suggestions`)
      .then((res) => {
        if (res.data?.suggestions) {
          setSuggestions(res.data.suggestions);
        }
      })
      .catch(() => {});
  }, [apiUrl]);

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSendMessage(promptText) {
    const textToSend = promptText || input;
    if (!textToSend.trim() || loading) return;

    const userMessage = { role: "user", content: textToSend };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const history = updatedMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await axios.post(`${apiUrl}/api/ai/chat`, {
        message: textToSend,
        history,
      });

      const assistantMessage = {
        role: "assistant",
        content: res.data.reply || "Here are some pieces you might love:",
        products: res.data.products || [],
        comparison: res.data.comparison || null,
        toolsUsed: res.data.toolsUsed || [],
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("AI Assistant request failed:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ I encountered an issue connecting to the catalogue. Please try asking again in a moment.",
          products: [],
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }

  function handleResetChat() {
    setMessages([
      {
        role: "assistant",
        content: `✨ **Chat reset!**\n\nWhat kind of jewellery can I help you find today?`,
        products: [],
      },
    ]);
  }

  return (
    <div className="min-h-screen bg-[#14213D] flex flex-col justify-between pt-4 pb-8 px-4 md:px-8">
      <div className="max-w-4xl w-full mx-auto flex-1 flex flex-col">
        {/* Header Bar */}
        <div className="flex items-center justify-between py-4 border-b border-white/10 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#C9A66B] to-[#FAF6EF] text-[#14213D] flex items-center justify-center font-bold text-xl shadow-lg">
              ✨
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-serif text-[#FBFFF1] flex items-center gap-2">
                Naari AI Shopping Agent
                <span className="text-[10px] uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono font-medium">
                  Live
                </span>
              </h1>
              <p className="text-xs text-gray-400">
                Natural-language discovery, smart matching & instant Razorpay checkout
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetChat}
              title="Reset conversation"
              className="text-gray-400 hover:text-white p-2 text-sm transition"
            >
              <FontAwesomeIcon icon={faRotateLeft} />
            </button>
            <Link
              to="/shop"
              className="hidden sm:inline-block text-xs border border-white/20 text-[#FBFFF1] px-3.5 py-1.5 rounded-full hover:bg-white/10 transition"
            >
              Browse Catalog
            </Link>
          </div>
        </div>

        {/* Conversation Box */}
        <div className="flex-1 overflow-y-auto py-4 space-y-2">
          {messages.map((msg, idx) => (
            <AIChatMessage key={idx} message={msg} />
          ))}

          {/* Thinking / Loading Animation */}
          {loading && (
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-2xl bg-[#C9A66B] text-[#14213D] flex items-center justify-center text-sm shadow-md animate-pulse">
                ✨
              </div>
              <div className="bg-[#FBFFF1] rounded-2xl rounded-tl-none px-4 py-3 shadow-sm border border-[#EBE4D5] flex items-center gap-2">
                <span className="text-xs font-medium text-[#73251C]">Searching & comparing jewellery...</span>
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-[#C9A66B] rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-[#C9A66B] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-[#C9A66B] rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Starter Suggestion Pills (Shown prominently if few messages) */}
        {messages.length <= 2 && (
          <div className="mb-4 pt-2">
            <p className="text-xs text-gray-400 mb-2 font-medium">💡 Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(s.prompt)}
                  className="bg-white/10 hover:bg-white/20 border border-white/15 text-[#FBFFF1] text-xs px-3 py-2 rounded-xl transition text-left backdrop-blur-sm shadow-xs"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Input Bar */}
        <div className="sticky bottom-0 pt-2 bg-[#14213D]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 bg-[#FBFFF1] rounded-2xl p-2 shadow-2xl border border-[#C9A66B]/30"
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="e.g. 'Show me earrings under ₹2000 for sister's birthday'..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              className="flex-1 bg-transparent px-4 py-2.5 text-sm text-[#14213D] focus:outline-none placeholder-gray-400"
            />

            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="bg-[#14213D] hover:bg-[#0b265e] text-[#FBFFF1] w-10 h-10 rounded-xl flex items-center justify-center transition disabled:opacity-40 shrink-0 shadow-md"
            >
              <FontAwesomeIcon icon={faPaperPlane} className="text-xs" />
            </button>
          </form>

          <p className="text-[11px] text-gray-400 text-center mt-2">
            ✨ Powered by Naari AI with real-time stock and secure Razorpay integration.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AIShopping;
