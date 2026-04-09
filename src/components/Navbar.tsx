import { motion } from "motion/react";
import { Shield, Users, MessageSquare, Search, Image as ImageIcon, Sparkles } from "lucide-react";
import { cn } from "../lib/utils";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const navItems = [
    { id: "home", label: "Ashecliffe", icon: Shield },
    { id: "characters", label: "Inmates", icon: Users },
    { id: "gallery", label: "Gallery", icon: ImageIcon },
    { id: "evidence", label: "Evidence", icon: Search },
    { id: "hallucination", label: "Vision", icon: Sparkles },
    { id: "chat", label: "Consultation", icon: MessageSquare },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-6 py-8 flex justify-between items-center pointer-events-none">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="pointer-events-auto"
      >
        <h1 className="text-2xl font-serif tracking-widest uppercase text-white/80 hover:text-white transition-colors cursor-pointer" onClick={() => setActiveTab("home")}>
          Ashecliffe
        </h1>
      </motion.div>

      <div className="flex gap-2 glass rounded-full p-1.5 pointer-events-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "relative px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-300",
              activeTab === item.id ? "text-white" : "text-white/40 hover:text-white/60"
            )}
          >
            {activeTab === item.id && (
              <motion.div
                layoutId="nav-pill"
                className="absolute inset-0 bg-white/10 rounded-full"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <item.icon size={16} />
            <span className="text-xs font-medium uppercase tracking-wider hidden sm:block">
              {item.label}
            </span>
          </button>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden md:block pointer-events-auto"
      >
        <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/30">
          Built By Manipal Sabhavat <br />
          Cognitive Management 2026
        </p>
      </motion.div>
    </nav>
  );
}
