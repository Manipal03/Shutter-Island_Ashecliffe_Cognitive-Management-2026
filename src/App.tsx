import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "motion/react";
import { Shield, ChevronDown, Wind, Waves, Eye } from "lucide-react";
import Navbar from "./components/Navbar";
import ParallaxCharacter from "./components/ParallaxCharacter";
import Chatbot from "./components/Chatbot";
import ImageAnalyzer from "./components/ImageAnalyzer";
import Gallery from "./components/Gallery";
import HallucinationGenerator from "./components/HallucinationGenerator";
import { CHARACTERS } from "./constants";
import { cn } from "./lib/utils";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Handle tab changes with scroll to top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab]);

  return (
    <div className="relative min-h-screen bg-asylum-dark selection:bg-asylum-accent selection:text-white">
      {/* Background Elements */}
      <div className="grain" />
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(61,74,92,0.15),transparent_70%)]" />
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-asylum-teal/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-asylum-red/5 blur-[120px] rounded-full animate-pulse [animation-delay:2s]" />
      </div>

      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-asylum-accent z-[60] origin-left"
        style={{ scaleX }}
      />

      <main className="relative z-10 pt-32 pb-24 px-6">
        <AnimatePresence mode="wait">
          {activeTab === "home" && (
            <motion.section
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-[80vh] flex flex-col items-center justify-center text-center space-y-12"
            >
              <div className="space-y-6 max-w-4xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center justify-center gap-3 text-asylum-accent mb-4"
                >
                  <Shield size={20} />
                  <span className="text-xs font-mono uppercase tracking-[0.5em]">Department of Corrections</span>
                </motion.div>
                
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-7xl md:text-9xl font-serif tracking-tighter leading-[0.85] text-white"
                >
                  SHUTTER <br />
                  <span className="italic text-white/20">ISLAND</span>
                </motion.h1>

                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-lg md:text-xl text-white/40 font-light max-w-2xl mx-auto leading-relaxed"
                >
                  Welcome to Ashecliffe Hospital. A place where the mind wanders, 
                  and the truth is buried beneath layers of fog and delusion. 
                  Explore the case files of our most notable residents.
                </motion.p>
              </div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="flex flex-wrap justify-center gap-6"
              >
                <button 
                  onClick={() => setActiveTab("characters")}
                  className="group relative px-8 py-4 bg-white text-asylum-dark font-mono uppercase tracking-widest text-xs rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95"
                >
                  <span className="relative z-10">Examine Inmates</span>
                  <div className="absolute inset-0 bg-asylum-accent translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </button>
                <button 
                  onClick={() => setActiveTab("chat")}
                  className="px-8 py-4 glass text-white font-mono uppercase tracking-widest text-xs rounded-full hover:bg-white/10 transition-all hover:scale-105 active:scale-95"
                >
                  Psychiatric Consultation
                </button>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute bottom-12 flex flex-col items-center gap-2 text-white/20"
              >
                <span className="text-[10px] font-mono uppercase tracking-widest">Scroll to Descend</span>
                <ChevronDown size={16} />
              </motion.div>

              {/* Decorative Icons */}
              <div className="absolute top-1/2 left-12 -translate-y-1/2 hidden xl:flex flex-col gap-12 text-white/5">
                <Wind size={48} strokeWidth={1} />
                <Waves size={48} strokeWidth={1} />
                <Eye size={48} strokeWidth={1} />
              </div>
            </motion.section>
          )}

          {activeTab === "characters" && (
            <motion.section
              key="characters"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-0"
            >
              <div className="text-center mb-16 space-y-4">
                <h2 className="text-5xl md:text-7xl font-serif">The Inmates</h2>
                <p className="text-white/40 font-mono uppercase tracking-[0.3em] text-xs">
                  Case Files & Psychological Profiles
                </p>
              </div>

              {/* Character Grid */}
              <div className="max-w-7xl mx-auto px-6 mb-32 grid grid-cols-2 md:grid-cols-4 gap-6">
                {CHARACTERS.map((char) => (
                  <motion.div
                    key={char.id}
                    whileHover={{ y: -10 }}
                    className="group relative aspect-[3/4] rounded-xl overflow-hidden border border-white/10 cursor-pointer"
                    onClick={() => {
                      const element = document.getElementById(`parallax-${char.id}`);
                      element?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    <img 
                      src={char.imageUrl} 
                      alt={char.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-asylum-dark via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-0 left-0 w-full p-4">
                      <p className="text-[10px] font-mono uppercase tracking-widest text-asylum-accent mb-1">{char.role.split(" / ")[0]}</p>
                      <h3 className="text-sm font-serif text-white truncate">{char.name.split(" / ")[0]}</h3>
                    </div>
                  </motion.div>
                ))}
              </div>

              {CHARACTERS.map((char, index) => (
                <div id={`parallax-${char.id}`} key={char.id}>
                  <ParallaxCharacter character={char} index={index} />
                </div>
              ))}
            </motion.section>
          )}

          {activeTab === "gallery" && (
            <motion.section
              key="gallery"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Gallery />
            </motion.section>
          )}

          {activeTab === "evidence" && (
            <motion.section
              key="evidence"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ImageAnalyzer />
            </motion.section>
          )}

          {activeTab === "hallucination" && (
            <motion.section
              key="hallucination"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <HallucinationGenerator />
            </motion.section>
          )}

          {activeTab === "chat" && (
            <motion.section
              key="chat"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="max-w-5xl mx-auto"
            >
              <div className="text-center mb-12 space-y-4">
                <h2 className="text-5xl md:text-7xl font-serif">Consultation</h2>
                <p className="text-white/40 font-mono uppercase tracking-[0.3em] text-xs">
                  Direct line to Dr. John Cawley
                </p>
              </div>
              <Chatbot />
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-12 border-t border-white/5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl font-serif tracking-widest uppercase opacity-50">Ashecliffe</h3>
            <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.2em]">
              © 1954 Ashecliffe Hospital for the Criminally Insane
            </p>
          </div>
          
          <div className="text-center md:text-right space-y-2">
            <p className="text-xs font-mono text-white/40 uppercase tracking-widest">
              Built By <span className="text-white/80">Manipal Sabhavat</span>
            </p>
            <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest">
              Cognitive Management 2026
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
