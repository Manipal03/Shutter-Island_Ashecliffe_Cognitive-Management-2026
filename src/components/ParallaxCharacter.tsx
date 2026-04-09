import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Character } from "../types";
import { cn } from "../lib/utils";

interface ParallaxCharacterProps {
  character: Character;
  index: number;
}

export default function ParallaxCharacter({ character, index }: ParallaxCharacterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.9]);

  return (
    <div 
      ref={containerRef} 
      className={cn(
        "min-h-screen flex items-center justify-center relative px-6 py-24",
        index % 2 === 0 ? "flex-row" : "flex-row-reverse"
      )}
    >
      <motion.div 
        style={{ y, opacity, scale }}
        className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
      >
        <div className={cn("relative group", index % 2 === 0 ? "order-1" : "order-2")}>
          <div className="absolute -inset-4 bg-asylum-accent/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
            <img 
              src={character.imageUrl} 
              alt={character.name}
              className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000 scale-110 group-hover:scale-100"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-asylum-dark via-transparent to-transparent opacity-60" />
            
            {/* Dossier Stamp */}
            <div className="absolute top-6 left-6 -rotate-12 pointer-events-none opacity-40 group-hover:opacity-80 transition-opacity">
              <div className="border-4 border-asylum-red px-4 py-1 rounded text-asylum-red font-mono text-xl font-bold uppercase tracking-tighter">
                CLASSIFIED
              </div>
            </div>
          </div>
          
          <div className="absolute -bottom-6 -right-6 glass p-6 rounded-xl max-w-xs hidden lg:block z-20">
            <p className="text-xs font-mono text-white/40 uppercase tracking-widest mb-2">Diagnosis</p>
            <p className="text-sm font-medium text-asylum-red/80 italic font-serif">"{character.disorder}"</p>
          </div>
        </div>

        <div className={cn("flex flex-col gap-6", index % 2 === 0 ? "order-2" : "order-1")}>
          <div className="space-y-2">
            <h2 className="text-5xl md:text-7xl font-serif tracking-tight leading-none">
              {character.name.split(" / ").map((part, i) => (
                <span key={i} className={cn("block", i > 0 && "text-white/30 text-3xl md:text-5xl italic mt-2")}>
                  {part}
                </span>
              ))}
            </h2>
            <p className="text-xs font-mono uppercase tracking-[0.4em] text-white/40">{character.role}</p>
          </div>

          <div className="h-px w-24 bg-asylum-accent" />

          <p className="text-lg text-white/60 leading-relaxed font-light max-w-lg">
            {character.description}
          </p>

          <blockquote className="border-l-2 border-asylum-accent pl-6 py-2 italic text-white/80 font-serif text-xl">
            {character.quote}
          </blockquote>
          
          <div className="lg:hidden">
            <p className="text-xs font-mono text-white/40 uppercase tracking-widest mb-1">Diagnosis</p>
            <p className="text-sm font-medium text-asylum-red/80 font-serif">{character.disorder}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
