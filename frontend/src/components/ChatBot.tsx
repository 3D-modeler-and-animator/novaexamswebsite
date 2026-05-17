import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

const faqs = [
  {
    q: "How do I book an exam?",
    a: "Click on 'Book Now' and follow the step-by-step booking process. Select your exam, date, and add mentorship if needed.",
  },
  {
    q: "What exams do you offer?",
    a: "We offer Duolingo, TOEFL, IELTS, TOLC, GRE, and GMAT exams.",
  },
  {
    q: "Do you provide mentorship?",
    a: "Yes! We offer optional mentorship programs to help you prepare for your exams.",
  },
  {
    q: "What payment methods are accepted?",
    a: "We accept payments through Chapa, supporting various Ethiopian payment methods.",
  },
  {
    q: "Where is your exam center?",
    a: "Our exam center is located in Addis Ababa, Ethiopia. Contact us for exact directions.",
  },
];

const novaHighlight = `Nova Exams Center helps students prepare and book international exams with ease. 
We provide mentorship, professional exam environments, and technical support to make your journey smooth.`;

const bookingInstruction =
  "Click on 'Book Now' and follow the step-by-step booking process. Select your exam, date, and add mentorship if needed.";

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>(
    [
      {
        text: "Hi! I'm Nova's AI assistant. How can I help you today?",
        isUser: false,
      },
    ],
  );
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [trialCount, setTrialCount] = useState(0);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = input.trim().toLowerCase();

    setMessages((prev) => [...prev, { text: input.trim(), isUser: true }]);

    setTrialCount((prev) => prev + 1);

    setIsLoading(true);

    setTimeout(() => {
      let response: string;

      if (trialCount === 0) {
        response = novaHighlight;
      } else {
        if (userMessage.includes("mentorship")) {
          response =
            "Yes! We offer optional mentorship programs to help you prepare for your exams.";
        } else if (userMessage.includes("payment")) {
          response =
            "We accept payments through Chapa, supporting various Ethiopian payment methods.";
        } else if (userMessage.includes("center")) {
          response =
            "Our exam center is located in Addis Ababa, Ethiopia. Contact us for exact directions.";
        } else if (userMessage.includes("book")) {
          response =
            "Click on 'Book Now' and follow the step-by-step booking process. Select your exam, date, and add mentorship if needed.";
        } else if (userMessage.includes("exam")) {
          response =
            "We offer Duolingo, TOEFL, IELTS, TOLC, GRE, and GMAT exams.";
        } else {
          const matchedFaq = faqs.find((faq) => {
            if (input.trim() === faq.q) return true;
            const words = faq.q.split(" ");
            return words.some((word) => input.trim().includes(word));
          });

          response = matchedFaq
            ? matchedFaq.a
            : `${novaHighlight}\n\nFor more assistance, please contact us directly at +251949700013 — Call us.`;
        }
      }

      response = `${response}\n\n${bookingInstruction}`;

      setMessages((prev) => [...prev, { text: response, isUser: false }]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-secondary text-secondary-foreground flex items-center justify-center shadow-lg hover:scale-110 transition-transform ${
          isOpen ? "hidden" : ""
        }`}
        aria-label="Open chat"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
      {isOpen && (
        <Card className="fixed bottom-6 right-6 z-50 w-80 md:w-96 shadow-2xl border-border animate-slide-up">
          <CardHeader className="bg-gradient-secondary text-secondary-foreground rounded-t-lg flex flex-row items-center justify-between py-4">
            <CardTitle className="text-lg font-display">
              Nova AI Assistant
            </CardTitle>
            <button onClick={() => setIsOpen(false)} aria-label="Close chat">
              <X className="w-5 h-5" />
            </button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-64 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm whitespace-pre-line ${
                      msg.isUser
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-muted text-foreground rounded-bl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Typing...
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-border flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type your question..."
                className="flex-1"
              />
              <Button onClick={handleSend} size="icon" variant="default">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
