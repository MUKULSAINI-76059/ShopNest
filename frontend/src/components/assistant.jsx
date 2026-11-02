import React, { useState } from "react";
import { Bot, MessageCircle, Send, Sparkles, X } from "lucide-react";
import "../style/assistant.css";

const replies = [
  {
    keywords: ["hello", "hi", "hey"],
    text: "Hi! I can help you find products, manage your cart, or learn about ShopNest.",
  },
  {
    keywords: ["product", "shop", "buy"],
    text: "You can browse all products from the Shop page. Open any product to see its details and add it to your cart.",
  },
  {
    keywords: ["cart", "checkout", "order"],
    text: "Open Cart from the navigation bar to review your items and continue to checkout.",
  },
  {
    keywords: ["return", "refund"],
    text: "You can find our return and refund information on the Return Policy page.",
  },
];

const getReply = (message) => {
  const normalizedMessage = message.toLowerCase();
  const matchingReply = replies.find(({ keywords }) =>
    keywords.some((keyword) => normalizedMessage.includes(keyword))
  );

  return (
    matchingReply?.text ||
    "I can help with products, your cart, orders, returns, and general ShopNest navigation."
  );
};

const Assistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "assistant",
      text: "Hi! How can I help you today?",
    },
  ]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      return;
    }

    setMessages((currentMessages) => [
      ...currentMessages,
      { id: Date.now(), sender: "user", text: trimmedMessage },
      { id: Date.now() + 1, sender: "assistant", text: getReply(trimmedMessage) },
    ]);
    setMessage("");
  };

  const askQuestion = (question) => {
    setMessage(question);
  };

  return (
    <div className="shop-assistant">
      {isOpen && (
        <section className="assistant-panel" aria-label="ShopNest assistant">
          <div className="assistant-header">
            <div className="assistant-title">
              <span className="assistant-avatar">
                <Bot size={20} aria-hidden="true" />
              </span>
              <div>
                <strong>ShopNest Assistant</strong>
                <span><i /> Online now</span>
              </div>
            </div>
            <button
              type="button"
              className="assistant-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close assistant"
            >
              <X size={19} aria-hidden="true" />
            </button>
          </div>

          <div className="assistant-messages" aria-live="polite">
            <div className="assistant-welcome">
              <span><Sparkles size={16} aria-hidden="true" /></span>
              <p>Ask me anything about shopping on ShopNest.</p>
            </div>
            {messages.map(({ id, sender, text }) => (
              <p key={id} className={`assistant-message ${sender}`}>
                {text}
              </p>
            ))}
          </div>

          <div className="assistant-prompts" aria-label="Suggested questions">
            {["Find products", "My cart", "Return policy"].map((prompt) => (
              <button
                type="button"
                key={prompt}
                onClick={() => askQuestion(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>

          <form className="assistant-form" onSubmit={handleSubmit}>
            <input
              type="text"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Ask something..."
              aria-label="Message the ShopNest assistant"
            />
            <button type="submit" aria-label="Send message">
              <Send size={17} aria-hidden="true" />
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        className="assistant-toggle"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? "Close assistant" : "Open assistant"}
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={24} aria-hidden="true" /> : <MessageCircle size={25} aria-hidden="true" />}
        {!isOpen && <span className="assistant-notification" />}
      </button>
    </div>
  );
};

export default Assistant;
