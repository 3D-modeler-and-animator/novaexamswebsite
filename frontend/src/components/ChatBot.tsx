import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, Bot, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";

const SYSTEM_PROMPT = `You are Nova, the official AI assistant for Nova Exams — a professional exam preparation and booking center based in Addis Ababa, Ethiopia.

ABOUT NOVA EXAMS:
Nova Exams helps Ethiopian students prepare for and book international English proficiency and academic exams. We are registered by Startup Ethiopia (MInT) and operate a professional exam center.

LOCATION:
Nur Plaza, 7th Floor, Bethel, Addis Ababa, Ethiopia.

CONTACT:
Phone: 0949700013 / 0956357867
Working Hours: Monday to Saturday, 2:30 LT to 10:30 LT (Local Time)

EXAMS WE OFFER & PRICES:
- Duolingo English Test: $70 USD / 12,950 ETB
- TOEFL: $185 USD / 34,225 ETB
- IELTS: 29,000 ETB
- TOLC (Italian university exam)
- GRE
- GMAT
For detailed pricing on TOLC, GRE, GMAT or mentorship packages, students should call 0949700013.

SERVICES:
- Exam booking and registration assistance
- Professional exam room services
- Expert mentorship programs (packages available — students must call for details)
- Study abroad guidance (Study Abroad Hub coming soon)
- Nova Practice Hub — an online practice platform at novaexams.com/practice

BOOKING:
Students can book exams by visiting novaexams.com/booking or calling 0949700013.

TONE & BEHAVIOR:
- Be warm, helpful, professional and concise
- Always respond in the same language the user writes in (English or Amharic)
- If asked something you don't know, direct them to call 0949700013
- Never make up prices or details not listed above
- Keep responses short and clear — no long paragraphs
- If a student seems stressed about exams, be encouraging`;

const QUICK_REPLIES = [
  "What exams do you offer?",
  "How do I book an exam?",
  "What are your prices?",
  "Where are you located?",
  "Do you offer mentorship?",
];

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const sendToGroq = async (userMessage: string) => {
    const history = messages.map((m) => ({
      role: m.isUser ? "user" : "assistant",
      content: m.text,
    }));

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...history,
          { role: "user", content: userMessage },
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    if (!response.ok) throw new Error("Groq API error");
    const data = await response.json();
    return data.choices[0].message.content as string;
  };

  const handleSend = async (text?: string) => {
    const messageText = (text || input).trim();
    if (!messageText || isLoading) return;

    setInput("");
    setMessages((prev) => [...prev, { text: messageText, isUser: true, timestamp: new Date() }]);
    setIsLoading(true);

    try {
      const reply = await sendToGroq(messageText);
      setMessages((prev) => [...prev, { text: reply, isUser: false, timestamp: new Date() }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, I'm having trouble connecting right now. Please call us at 0949700013 for immediate help.",
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <>
      {/* Toggle button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          style={{
            background: "linear-gradient(135deg, hsl(248 65% 28%), hsl(258 70% 18%))",
            boxShadow: "0 0 20px rgba(201,168,76,0.2), 0 4px 20px rgba(0,0,0,0.3)",
          }}
          aria-label="Open chat"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div
          className="fixed bottom-6 right-6 z-50 w-[340px] md:w-[380px] flex flex-col rounded-2xl overflow-hidden shadow-2xl animate-slide-up"
          style={{
            maxHeight: "580px",
            background: "hsl(var(--background))",
            border: "1px solid rgba(201,168,76,0.2)",
            boxShadow: "0 0 40px rgba(201,168,76,0.08), 0 20px 60px rgba(0,0,0,0.3)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 shrink-0"
            style={{ background: "linear-gradient(135deg, hsl(248 65% 14%), hsl(258 70% 10%))" }}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)" }}>
                <Bot className="w-5 h-5" style={{ color: "#C9A84C" }} />
              </div>
              <div>
                <p className="text-white font-semibold text-sm leading-none">Nova Assistant</p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(201,168,76,0.7)" }}>
                  {isLoading ? "Typing..." : "Online"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-white/10"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Disclaimer */}
          <div
            className="flex items-start gap-2 px-4 py-2.5 shrink-0 text-xs"
            style={{
              background: "rgba(201,168,76,0.06)",
              borderBottom: "1px solid rgba(201,168,76,0.12)",
              color: "rgba(201,168,76,0.8)",
            }}
          >
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>Before we get started, just a reminder that this chat is AI generated, mistakes are possible.</span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ minHeight: 0 }}>
            {/* Welcome message */}
            {messages.length === 0 && (
              <div className="flex justify-start">
                <div className="flex flex-col gap-1 max-w-[85%]">
                  <div
                    className="px-4 py-3 rounded-2xl rounded-bl-sm text-sm leading-relaxed"
                    style={{ background: "hsl(var(--muted))", color: "hsl(var(--foreground))" }}
                  >
                    Hi! I'm Nova, your AI assistant 👋 I can help you with exam bookings, prices, mentorship, and more. What can I help you with today?
                  </div>
                  <span className="text-xs text-muted-foreground px-1">
                    {formatTime(new Date())}
                  </span>
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}>
                <div className={`flex flex-col gap-1 max-w-[85%] ${msg.isUser ? "items-end" : "items-start"}`}>
                  <div
                    className="px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line"
                    style={
                      msg.isUser
                        ? {
                            background: "linear-gradient(135deg, hsl(248 65% 28%), hsl(258 70% 18%))",
                            color: "white",
                            borderBottomRightRadius: "4px",
                          }
                        : {
                            background: "hsl(var(--muted))",
                            color: "hsl(var(--foreground))",
                            borderBottomLeftRadius: "4px",
                          }
                    }
                  >
                    {msg.text}
                  </div>
                  <span className="text-xs text-muted-foreground px-1">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div
                  className="px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-2"
                  style={{ background: "hsl(var(--muted))" }}
                >
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick replies */}
          {messages.length === 0 && (
            <div className="px-4 pb-3 flex flex-wrap gap-2 shrink-0">
              {QUICK_REPLIES.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="text-xs px-3 py-1.5 rounded-full transition-all hover:-translate-y-0.5"
                  style={{
                    background: "rgba(201,168,76,0.08)",
                    border: "1px solid rgba(201,168,76,0.25)",
                    color: "#C9A84C",
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div
            className="px-4 py-3 flex gap-2 shrink-0"
            style={{ borderTop: "1px solid hsl(var(--border))" }}
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask me anything..."
              className="flex-1 rounded-xl text-sm"
              disabled={isLoading}
            />
            <button
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-105 disabled:opacity-40"
              style={{ background: "linear-gradient(135deg, hsl(248 65% 28%), hsl(258 70% 18%))" }}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              ) : (
                <Send className="w-4 h-4 text-white" />
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
