import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Upload, Search, Loader2, FileText, Image as ImageIcon, AlertCircle } from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from "react-markdown";
import { cn } from "../lib/utils";

const SYSTEM_INSTRUCTION = `You are an expert criminal investigator and forensic psychiatrist. 
You are analyzing evidence from the Ashecliffe Hospital case on Shutter Island. 
When you see an image, you should analyze it for clues, hidden meanings, and psychological significance. 
Connect what you see to the themes of Shutter Island: trauma, identity, conspiracy, and the thin line between reality and delusion. 
Your tone is sharp, analytical, and slightly paranoid. 
If the image is unrelated to the movie, try to find a way to connect it to the "case" or "investigation". 
Keep your analysis concise but insightful. Use terms like "evidence", "clue", "psychological profile", and "asylum".`;

export default function ImageAnalyzer() {
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        setError("Evidence file too large. Maximum size is 4MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setAnalysis(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeEvidence = async () => {
    if (!image || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
      const base64Data = image.split(",")[1];
      const mimeType = image.split(";")[0].split(":")[1];

      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: {
          parts: [
            { text: "Analyze this piece of evidence from Shutter Island. What does it reveal about the case?" },
            { inlineData: { data: base64Data, mimeType } }
          ]
        },
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        }
      });

      setAnalysis(response.text || "The evidence is inconclusive. The fog is too thick.");
    } catch (err) {
      console.error("Analysis error:", err);
      setError("The investigation has been compromised. Unable to process evidence.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 py-12">
      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-6xl font-serif tracking-tight">Evidence Processing</h2>
        <p className="text-white/40 font-mono uppercase tracking-[0.3em] text-xs">
          Upload visual data for forensic psychiatric analysis
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-6">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "relative aspect-square rounded-3xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer transition-all duration-500 overflow-hidden group",
              image ? "border-asylum-accent/50" : "hover:border-white/30 hover:bg-white/5"
            )}
          >
            <AnimatePresence mode="wait">
              {image ? (
                <motion.div 
                  key="preview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0"
                >
                  <img 
                    src={image} 
                    alt="Evidence" 
                    className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-asylum-dark/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs font-mono uppercase tracking-widest bg-asylum-dark/80 px-4 py-2 rounded-full border border-white/10">
                      Replace Evidence
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="placeholder"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-center p-8 space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto border border-white/10 group-hover:scale-110 transition-transform">
                    <Upload size={24} className="text-white/40 group-hover:text-white/80 transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-white/80 font-medium">Submit Evidence</p>
                    <p className="text-white/30 text-xs">Drag and drop or click to browse</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              accept="image/*" 
              className="hidden" 
            />
          </div>

          <button
            onClick={analyzeEvidence}
            disabled={!image || isLoading}
            className={cn(
              "w-full py-4 rounded-2xl font-mono uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-3",
              image && !isLoading 
                ? "bg-asylum-accent/40 hover:bg-asylum-accent/60 text-white border border-white/10" 
                : "bg-white/5 text-white/20 cursor-not-allowed border border-white/5"
            )}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Processing Evidence...
              </>
            ) : (
              <>
                <Search size={18} />
                Analyze Visual Data
              </>
            )}
          </button>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-asylum-red/20 border border-asylum-red/40 flex items-center gap-3 text-asylum-red text-sm"
            >
              <AlertCircle size={18} />
              {error}
            </motion.div>
          )}
        </div>

        <div className="glass rounded-3xl p-8 min-h-[400px] flex flex-col border-white/5">
          <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-6">
            <div className="w-10 h-10 rounded-full bg-asylum-accent/20 flex items-center justify-center border border-white/10">
              <FileText size={20} className="text-white/60" />
            </div>
            <div>
              <h3 className="font-serif text-xl">Forensic Report</h3>
              <p className="text-[10px] uppercase tracking-widest text-white/30 mt-1">Case File: #67-LAEDDIS</p>
            </div>
          </div>

          <div className="flex-1">
            <AnimatePresence mode="wait">
              {analysis ? (
                <motion.div
                  key="analysis"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-1"
                >
                  <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown>{analysis}</ReactMarkdown>
                  </div>
                </motion.div>
              ) : isLoading ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12"
                >
                  <div className="relative">
                    <Loader2 size={48} className="animate-spin text-asylum-accent/40" />
                    <Search size={20} className="absolute inset-0 m-auto text-white/60" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-white/60 font-medium italic">"The mind sees what it wants to see..."</p>
                    <p className="text-white/20 text-xs font-mono uppercase tracking-widest">Scanning for psychological markers</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12 opacity-20"
                >
                  <ImageIcon size={64} strokeWidth={1} />
                  <p className="text-sm font-mono uppercase tracking-widest">Awaiting Evidence Submission</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
            <div className="flex gap-1">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-1 h-1 rounded-full bg-asylum-accent/40" />
              ))}
            </div>
            <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest">
              Ashecliffe Forensic Unit
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
