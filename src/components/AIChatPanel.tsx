import React, { useState } from "react";

/**
 * AI Chat Panel Component
 *
 * This is a React component that provides the chat interface for the AI assistant.
 * It's registered with Univer using univerAPI.registerComponent() and displayed
 * in a sidebar when the user clicks the toolbar button or presses Cmd+K.
 */
export function AIChatPanel() {
  const [messages, setMessages] = useState<
    Array<{ id: string; role: "user" | "assistant"; content: string }>
  >([
    {
      id: "1",
      role: "assistant",
      content:
        "👋 Hi! I'm your AI assistant. Ask me to help with your spreadsheet!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      role: "user" as const,
      content: input,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMsg = {
        id: (Date.now() + 1).toString(),
        role: "assistant" as const,
        content: `I understand: "${input}"\n\nI'll help you with that using the Univer API!`,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        backgroundColor: "white",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px",
          borderBottom: "1px solid #e5e7eb",
          backgroundColor: "#f9fafb",
        }}
      >
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600 }}>
          AI Assistant
        </h3>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                maxWidth: "80%",
                padding: "12px",
                borderRadius: "8px",
                backgroundColor: msg.role === "user" ? "#2563eb" : "#f3f4f6",
                color: msg.role === "user" ? "white" : "#111827",
                fontSize: "14px",
                whiteSpace: "pre-wrap",
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={{ display: "flex", gap: "4px" }}>
            <div
              style={{
                width: "8px",
                height: "8px",
                backgroundColor: "#9ca3af",
                borderRadius: "50%",
                animation: "bounce 1s infinite",
              }}
            />
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        style={{
          padding: "16px",
          borderTop: "1px solid #e5e7eb",
          display: "flex",
          gap: "8px",
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
          style={{
            flex: 1,
            padding: "8px 12px",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            fontSize: "14px",
            outline: "none",
          }}
        />
        <button
          type="submit"
          disabled={!input.trim()}
          style={{
            padding: "8px 16px",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: 500,
            cursor: input.trim() ? "pointer" : "not-allowed",
            opacity: input.trim() ? 1 : 0.5,
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}
