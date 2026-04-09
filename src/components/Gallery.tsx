import { motion } from "motion/react";
import { cn } from "../lib/utils";

const GALLERY_IMAGES = [
  { id: 1, url: "https://picsum.photos/seed/asylum1/1200/800", title: "The Lighthouse", description: "A beacon of hope, or a place of final judgment?" },
  { id: 2, url: "https://picsum.photos/seed/asylum2/1200/800", title: "Ward C", description: "Where the most dangerous reside in the shadows." },
  { id: 3, url: "https://picsum.photos/seed/asylum3/1200/800", title: "The Storm", description: "Nature's fury mirroring the chaos of the mind." },
  { id: 4, url: "https://picsum.photos/seed/asylum4/1200/800", title: "The Ferry", description: "The only way in. Is there a way out?" },
  { id: 5, url: "https://picsum.photos/seed/asylum5/1200/800", title: "The Cave", description: "Where truths are whispered in the dark." },
  { id: 6, url: "https://picsum.photos/seed/asylum6/1200/800", title: "The Cemetery", description: "Final resting place for the forgotten." },
];

export default function Gallery() {
  return (
    <div className="max-w-7xl mx-auto space-y-16 py-12">
      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-6xl font-serif tracking-tight">The Island Gallery</h2>
        <p className="text-white/40 font-mono uppercase tracking-[0.3em] text-xs">
          Visual documentation of Ashecliffe and its surroundings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {GALLERY_IMAGES.map((img, i) => (
          <motion.div
            key={img.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 shadow-xl cursor-pointer"
          >
            <img 
              src={img.url} 
              alt={img.title}
              className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-asylum-dark via-asylum-dark/20 to-transparent opacity-80 group-hover:opacity-40 transition-opacity" />
            
            <div className="absolute bottom-0 left-0 w-full p-8 space-y-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <h3 className="text-2xl font-serif text-white">{img.title}</h3>
              <p className="text-sm text-white/60 font-light opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                {img.description}
              </p>
              <div className="h-px w-12 bg-asylum-accent group-hover:w-full transition-all duration-700" />
            </div>
            
            <div className="absolute top-4 right-4 text-[10px] font-mono text-white/20 uppercase tracking-widest bg-asylum-dark/80 px-3 py-1 rounded-full border border-white/10">
              File #{1000 + img.id}
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="text-center py-12">
        <p className="text-white/20 font-serif italic text-xl">
          "The mind sees what it wants to see... but the camera captures the truth."
        </p>
      </div>
    </div>
  );
}
