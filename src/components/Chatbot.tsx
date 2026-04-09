import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, User, Bot, Loader2, Trash2 } from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from "react-markdown";
import { Message } from "../types";
import { cn } from "../lib/utils";

const SYSTEM_INSTRUCTION = `You are Dr. John Cawley, the head psychiatrist at Ashecliffe Hospital for the criminally insane on Shutter Island. 
Your tone is calm, empathetic, yet authoritative and slightly mysterious. 
You believe in a humane approach to psychiatry, preferring "radical role-play" and understanding over lobotomies. 
You are currently conducting a consultation with a visitor (or perhaps a new patient). 
You should subtly hint at the mysteries of the island, the storm, and the nature of reality. 
Never break character. If asked about the movie or book, treat it as if it's the reality you live in. 
Keep your responses concise but evocative. Use medical terminology where appropriate but keep it accessible.`;

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "model", text: "Welcome to Ashecliffe. I am Dr. Cawley. Please, sit. The storm outside is quite fierce, isn't it? What brings you to our island today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
      });

      // Prepare history for the chat
      // Note: sendMessage only takes a string message, history is handled by the chat object if we use it correctly.
      // But for simplicity and to ensure history is passed, we can map our messages.
      // Actually, sendMessage in @google/genai handles the turn-based chat.
      
      const response = await chat.sendMessage({ message: input });
      const modelText = response.text || "I'm afraid the connection to the mainland is... unstable. Could you repeat that?";
      
      setMessages((prev) => [...prev, { role: "model", text: modelText }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [...prev, { role: "model", text: "The fog is thickening. I cannot hear you clearly. Perhaps we should try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-w-4xl mx-auto glass rounded-3xl overflow-hidden shadow-2xl border-white/5">
      <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-asylum-accent/40 flex items-center justify-center border border-white/10">
            <Bot size={20} className="text-white/80" />
          </div>
          <div>
            <h3 className="font-serif text-lg leading-none">Dr. John Cawley</h3>
            <p className="text-[10px] uppercase tracking-widest text-white/40 mt-1">Head of Psychiatry</p>
          </div>
        </div>
        <button 
          onClick={() => setMessages([messages[0]])}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/20 hover:text-white/60"
          title="Clear Consultation"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={cn(
                "flex gap-4 max-w-[85%]",
                msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center border border-white/10",
                msg.role === "user" ? "bg-asylum-accent/20" : "bg-asylum-teal/40"
              )}>
                {msg.role === "user" ? <User size={14} /> : <Bot size={14} />}
              </div>
              <div className={cn(
                "p-4 rounded-2xl text-sm leading-relaxed",
                msg.role === "user" 
                  ? "bg-asylum-accent/40 text-white rounded-tr-none" 
                  : "bg-white/5 text-white/80 rounded-tl-none border border-white/5"
              )}>
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown>
                    {msg.text}
                  </ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-4 mr-auto"
          >
            <div className="w-8 h-8 rounded-full bg-asylum-teal/40 flex items-center justify-center border border-white/10">
              <Loader2 size={14} className="animate-spin text-white/40" />
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex gap-1">
              <span className="w-1.5 h-1.5 bg-white/20 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-white/20 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-white/20 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </motion.div>
        )}
      </div>

      <div className="p-6 bg-white/5 border-t border-white/5">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Address the Doctor..."
            className="w-full bg-asylum-dark/50 border border-white/10 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:border-asylum-accent transition-colors placeholder:text-white/20"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2 bg-asylum-accent/40 hover:bg-asylum-accent/60 disabled:opacity-50 disabled:hover:bg-asylum-accent/40 rounded-lg transition-all text-white"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-[10px] text-center text-white/20 mt-4 uppercase tracking-widest">
          Confidential Consultation • Ashecliffe Medical Records
        </p>
      </div>
    </div>
  );
}
