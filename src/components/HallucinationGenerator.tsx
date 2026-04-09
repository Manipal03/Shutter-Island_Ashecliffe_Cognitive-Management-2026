import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Loader2, Download, RefreshCw, AlertCircle, Eye } from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import { cn } from "../lib/utils";

export default function HallucinationGenerator() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateHallucination = async () => {
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setImage(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
      
      // Using gemini-2.5-flash-image for image generation
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: {
          parts: [
            { text: `A dark, cinematic, atmospheric scene from Shutter Island: ${prompt}. Style: 1950s noir, grainy film, moody lighting, psychological thriller.` }
          ]
        },
        config: {
          imageConfig: {
            aspectRatio: "16:9"
          }
        }
      });

      let generatedImageUrl = null;
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          generatedImageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }

      if (generatedImageUrl) {
        setImage(generatedImageUrl);
      } else {
        throw new Error("The fog is too thick. No image could be formed.");
      }
    } catch (err) {
      console.error("Generation error:", err);
      setError("Your mind is playing tricks on you. The vision failed to manifest.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 py-12">
      <div className="text-center space-y-4">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-asylum-accent/20 rounded-full border border-white/10">
            <Eye size={32} className="text-asylum-accent" />
          </div>
        </div>
        <h2 className="text-4xl md:text-6xl font-serif tracking-tight">Hallucination Generator</h2>
        <p className="text-white/40 font-mono uppercase tracking-[0.3em] text-xs">
          Manifest your deepest delusions into visual reality
        </p>
      </div>

      <div className="glass rounded-3xl p-8 border-white/5 space-y-8">
        <div className="space-y-4">
          <label className="text-xs font-mono uppercase tracking-widest text-white/40 ml-2">
            Describe the vision
          </label>
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A lighthouse in the storm... a woman in a yellow dress... the lighthouse stairs..."
              className="w-full bg-asylum-dark/50 border border-white/10 rounded-2xl p-6 pt-8 text-lg focus:outline-none focus:border-asylum-accent transition-all min-h-[120px] resize-none placeholder:text-white/10"
            />
            <div className="absolute top-3 right-4 flex gap-2">
              <Sparkles size={16} className="text-asylum-accent animate-pulse" />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={generateHallucination}
            disabled={!prompt.trim() || isLoading}
            className={cn(
              "flex-1 py-4 rounded-xl font-mono uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-3",
              prompt.trim() && !isLoading 
                ? "bg-asylum-accent/40 hover:bg-asylum-accent/60 text-white border border-white/10" 
                : "bg-white/5 text-white/20 cursor-not-allowed border border-white/5"
            )}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Manifesting...
              </>
            ) : (
              <>
                <RefreshCw size={18} />
                Generate Vision
              </>
            )}
          </button>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-xl bg-asylum-red/20 border border-asylum-red/40 flex items-center gap-3 text-asylum-red text-sm"
          >
            <AlertCircle size={18} />
            {error}
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {image && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
                <img 
                  src={image} 
                  alt="Generated Hallucination" 
                  className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-asylum-dark via-transparent to-transparent opacity-60" />
                
                <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a 
                    href={image} 
                    download="hallucination.png"
                    className="p-3 bg-asylum-dark/80 hover:bg-asylum-accent/80 rounded-full border border-white/10 transition-all"
                  >
                    <Download size={18} />
                  </a>
                </div>
              </div>
              
              <div className="p-6 bg-white/5 rounded-2xl border border-white/5 italic text-white/60 text-center font-serif text-lg">
                "Is it real? Or is it just another trick of the mind?"
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!image && !isLoading && (
          <div className="aspect-video rounded-2xl border border-dashed border-white/5 flex flex-col items-center justify-center text-white/10 space-y-4">
            <Eye size={48} strokeWidth={1} />
            <p className="text-xs font-mono uppercase tracking-[0.2em]">Awaiting Mental Manifestation</p>
          </div>
        )}
      </div>
    </div>
  );
}
