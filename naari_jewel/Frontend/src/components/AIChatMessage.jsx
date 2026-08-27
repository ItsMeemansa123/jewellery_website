import AIProductCard from "./AIProductCard";
import AIComparisonTable from "./AIComparisonTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

// Basic markdown-like parser for clean rendering without external heavy packages
function formatMessageContent(content) {
  if (!content) return null;

  const lines = content.split("\n");
  return lines.map((line, index) => {
    // Bold formatting: **text**
    let formatted = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    // Italic formatting: *text*
    formatted = formatted.replace(/\*(.*?)\*/g, "<em>$1</em>");

    // Bullet point lines
    if (line.trim().startsWith("- ") || line.trim().startsWith("• ")) {
      return (
        <li
          key={index}
          className="ml-4 list-disc text-sm text-gray-800 my-0.5"
          dangerouslySetInnerHTML={{ __html: formatted.replace(/^[-•]\s*/, "") }}
        />
      );
    }

    // Standard paragraph or empty line
    if (!line.trim()) {
      return <div key={index} className="h-2" />;
    }

    return (
      <p
        key={index}
        className="text-sm leading-relaxed text-gray-800"
        dangerouslySetInnerHTML={{ __html: formatted }}
      />
    );
  });
}

function AIChatMessage({ message }) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end items-start gap-2 mb-4">
        <div className="bg-[#14213D] text-[#FBFFF1] rounded-2xl rounded-tr-none px-4 py-3 max-w-[85%] md:max-w-md shadow-sm">
          <p className="text-sm">{message.content}</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-[#162e61] text-[#FBFFF1] flex items-center justify-center text-xs shrink-0 mt-0.5">
          <FontAwesomeIcon icon={faUser} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start items-start gap-3 mb-6">
      {/* Bot Icon */}
      <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#14213D] to-[#C9A66B] text-white flex items-center justify-center text-sm shadow-md shrink-0 mt-1">
        ✨
      </div>

      <div className="flex-1 max-w-[95%] md:max-w-2xl space-y-3">
        {/* Main message bubble */}
        <div className="bg-[#FBFFF1] rounded-2xl rounded-tl-none p-4 shadow-sm border border-[#EBE4D5]">
          {/* Tools Badge */}
          {message.toolsUsed && message.toolsUsed.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 mb-2.5 pb-2 border-b border-[#E9DFCF]">
              <span className="text-[11px] text-[#73251C] font-semibold flex items-center gap-1">
                ⚡ Agent Action:
              </span>
              {message.toolsUsed.map((tool, idx) => (
                <span
                  key={idx}
                  className="text-[10px] bg-[#14213D]/10 text-[#14213D] font-mono px-2 py-0.5 rounded-md"
                >
                  {tool}()
                </span>
              ))}
            </div>
          )}

          <div className="space-y-1">{formatMessageContent(message.content)}</div>
        </div>

        {/* Product Recommendations Grid */}
        {message.products && message.products.length > 0 && (
          <div className="pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {message.products.map((product) => (
                <AIProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        )}

        {/* Product Comparison View */}
        {message.comparison && (
          <div className="pt-1">
            <AIComparisonTable comparison={message.comparison} />
          </div>
        )}
      </div>
    </div>
  );
}

export default AIChatMessage;
