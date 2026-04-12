import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import DNAHelix from "@/components/DNAHelix";
import DNAHelix3D from "@/components/DNAHelix3D";
import TypingTitle from "@/components/TypingTitle";
import DNABlocks from "@/components/DNABlocks";
import { Copy, RotateCcw, Zap, Unlock, ChevronDown } from "lucide-react";

const BINARY_MAP: Record<string, string> = { "00": "A", "01": "T", "10": "C", "11": "G" };
const DNA_MAP: Record<string, string> = { A: "00", T: "01", C: "10", G: "11" };

function textToBinary(text: string): string {
  return text.split("").map((c) => c.charCodeAt(0).toString(2).padStart(8, "0")).join("");
}
function binaryToDNA(binary: string): string {
  let dna = "";
  for (let i = 0; i < binary.length; i += 2) dna += BINARY_MAP[binary.substring(i, i + 2)] || "";
  return dna;
}
function dnaToBinary(dna: string): string {
  return dna.split("").map((b) => DNA_MAP[b] || "").join("");
}
function binaryToText(binary: string): string {
  let text = "";
  for (let i = 0; i < binary.length; i += 8) text += String.fromCharCode(parseInt(binary.substring(i, i + 8), 2));
  return text;
}

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const Index = () => {
  const [inputText, setInputText] = useState("");
  const [binaryOutput, setBinaryOutput] = useState("");
  const [dnaOutput, setDnaOutput] = useState("");
  const [decodedText, setDecodedText] = useState("");
  const [isEncoding, setIsEncoding] = useState(false);
  const [step, setStep] = useState(0);

  const handleEncode = useCallback(() => {
    if (!inputText.trim()) { toast.error("Please enter some text to encode!"); return; }
    setDecodedText("");
    setIsEncoding(true);
    setStep(0);
    setTimeout(() => {
      const binary = textToBinary(inputText);
      setBinaryOutput(binary);
      setStep(1);
      setTimeout(() => {
        const dna = binaryToDNA(binary);
        setDnaOutput(dna);
        setStep(2);
        setIsEncoding(false);
      }, 800);
    }, 600);
  }, [inputText]);

  const handleDecode = useCallback(() => {
    if (!dnaOutput) { toast.error("No DNA sequence to decode! Encode some text first."); return; }
    setDecodedText(binaryToText(dnaToBinary(dnaOutput)));
    setStep(3);
  }, [dnaOutput]);

  const handleCopy = useCallback(() => {
    if (dnaOutput) { navigator.clipboard.writeText(dnaOutput); toast.success("DNA sequence copied!"); }
  }, [dnaOutput]);

  const handleReset = useCallback(() => {
    setInputText(""); setBinaryOutput(""); setDnaOutput(""); setDecodedText(""); setStep(0); setIsEncoding(false);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <DNAHelix />

      {/* Grid overlay */}
      <div className="grid-overlay" style={{ zIndex: 0 }} />

      {/* Enhanced gradient overlay — brighter, premium dark-blue */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1, background: "linear-gradient(160deg, hsl(220 45% 6%) 0%, hsl(217 50% 10%) 35%, hsl(210 45% 9%) 60%, hsl(200 60% 12%) 100%)" }} />
      {/* Soft vignette */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1, background: "radial-gradient(ellipse at center, transparent 50%, hsl(220 45% 4% / 0.5) 100%)" }} />

      <div className="relative z-10">
        {/* Header */}
        <header className="relative min-h-[70vh] flex flex-col items-center justify-center text-center px-4 pt-12">
          {/* Radial hero light */}
          <div className="radial-hero-light" />
          {/* 3D DNA Helix */}
          <DNAHelix3D />

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-display tracking-widest uppercase border border-primary/30 text-primary mb-6"
              style={{ boxShadow: "0 0 12px hsl(185 100% 50% / 0.2)" }}>
              Bioinformatics Project
            </span>
          </motion.div>

          <div className="shimmer glow-reflection">
            <TypingTitle text="DNA Data Storage System" />
          </div>

          {/* Neon underline */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 2.2, duration: 0.8 }}
            className="mt-3 w-48 md:w-72 mx-auto"
          >
            <span className="neon-line w-full" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5, duration: 0.6 }}
            className="mt-4 text-lg md:text-xl text-muted-foreground font-body max-w-xl"
          >
            Future of Data Storage — Inspired by Biology
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }} className="mt-10">
            <a href="#encode" className="text-muted-foreground hover:text-primary transition-colors">
              <ChevronDown className="w-6 h-6 animate-bounce" />
            </a>
          </motion.div>
        </header>

        {/* Encode Section */}
        <motion.section
          id="encode"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-3xl mx-auto px-4 py-16"
        >
          <div className="glass glow-box shimmer rounded-2xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-display font-semibold text-foreground mb-1">
              <Zap className="inline w-5 h-5 text-primary mr-2 icon-glow" />
              Encode Text to DNA
            </h2>
            <p className="text-muted-foreground text-sm mb-5 font-body">Enter any text to convert it into a DNA sequence</p>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message here..."
              rows={4}
              className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-foreground font-body text-base focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/40 resize-none placeholder:text-muted-foreground/50 transition-all"
              style={{ boxShadow: "inset 0 2px 10px hsl(220 20% 4% / 0.5)" }}
            />
            <div className="flex gap-3 mt-4">
              <button onClick={handleEncode} disabled={isEncoding} className="btn-glow bg-primary text-primary-foreground font-display text-sm font-semibold px-6 py-2.5 rounded-xl disabled:opacity-50 transition-all">
                {isEncoding ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Encoding...
                  </span>
                ) : "Encode"}
              </button>
              <button onClick={handleReset} className="bg-muted hover:bg-muted/80 text-muted-foreground font-display text-sm font-semibold px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 hover:text-primary">
                <RotateCcw className="w-4 h-4" /> Reset
              </button>
            </div>
          </div>
        </motion.section>

        {/* Results */}
        <AnimatePresence>
          {step >= 1 && (
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto px-4 pb-8"
            >
              <div className="glass glow-box rounded-2xl p-6 md:p-8 mb-6 glow-reflection">
                <h3 className="text-lg font-display font-semibold text-foreground mb-1">Step 1: Binary Representation</h3>
                <p className="text-muted-foreground text-xs mb-3 font-body">Each character converted to 8-bit ASCII binary</p>
                <div className="bg-muted/40 rounded-xl p-4 font-mono text-xs md:text-sm text-primary break-all leading-relaxed max-h-40 overflow-y-auto"
                  style={{ textShadow: "0 0 8px hsl(185 100% 50% / 0.4)" }}>
                  {binaryOutput}
                </div>
              </div>
            </motion.section>
          )}

          {step >= 2 && (
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto px-4 pb-8"
            >
              <div className="glass glow-box rounded-2xl p-6 md:p-8 glow-reflection">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-lg font-display font-semibold text-foreground">Step 2: DNA Sequence</h3>
                  <button onClick={handleCopy} className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 text-xs font-display hover:drop-shadow-[0_0_6px_hsl(185_100%_50%/0.5)]">
                    <Copy className="w-4 h-4" /> Copy
                  </button>
                </div>
                <p className="text-muted-foreground text-xs mb-3 font-body">
                  Binary pairs mapped: 00→A(Red) 01→T(Blue) 10→C(Green) 11→G(Yellow)
                </p>
                <div className="max-h-64 overflow-y-auto">
                  <DNABlocks sequence={dnaOutput} />
                </div>
                <p className="mt-3 text-xs text-muted-foreground font-body">
                  Sequence length: {dnaOutput.length} bases
                </p>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Decode Section */}
        {step >= 2 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto px-4 py-8"
          >
            <div className="glass glow-box shimmer rounded-2xl p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-display font-semibold text-foreground mb-1">
                <Unlock className="inline w-5 h-5 text-accent mr-2 icon-glow" />
                Decode DNA Back to Text
              </h2>
              <p className="text-muted-foreground text-sm mb-5 font-body">Reverse the process: DNA → Binary → Text</p>
              <button onClick={handleDecode} className="btn-glow bg-accent text-accent-foreground font-display text-sm font-semibold px-6 py-2.5 rounded-xl transition-all">
                Decode
              </button>
              <AnimatePresence>
                {decodedText && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-5">
                    <p className="text-xs text-muted-foreground font-body mb-2">Decoded Output:</p>
                    <div className="bg-muted/40 rounded-xl p-4 text-foreground font-body text-base md:text-lg"
                      style={{ textShadow: "0 0 6px hsl(185 100% 50% / 0.3)" }}>
                      {decodedText}
                    </div>
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 20 }}
                      className="mt-4 flex justify-center"
                    >
                      {decodedText === inputText ? (
                        <span className="decode-match-success inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-display font-semibold">
                          <motion.span
                            initial={{ scale: 0, rotate: -90 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.5, type: "spring", stiffness: 400, damping: 12 }}
                            className="text-base"
                          >✔</motion.span>
                          Perfect match with original
                        </span>
                      ) : (
                        <motion.span
                          animate={{ x: [0, -4, 4, -4, 4, 0] }}
                          transition={{ delay: 0.4, duration: 0.4 }}
                          className="decode-match-error inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-display font-semibold"
                        >
                          <span className="text-base">✖</span>
                          Data mismatch detected
                        </motion.span>
                      )}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.section>
        )}

        {/* Info Section */}
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-3xl mx-auto px-4 py-16"
        >
          <div className="glass glow-box shimmer rounded-2xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-display font-semibold text-foreground mb-4">About DNA Data Storage</h2>
            <div className="space-y-4 text-muted-foreground font-body text-sm md:text-base leading-relaxed">
              <p>
                DNA data storage encodes digital information into synthetic DNA strands. Each nucleotide base (A, T, C, G) can represent 2 bits of data, making DNA an incredibly dense storage medium.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {[
                  { title: "Ultra-High Density", desc: "1 gram of DNA can store ~215 petabytes of data" },
                  { title: "Extreme Longevity", desc: "DNA can last thousands of years in proper conditions" },
                  { title: "Energy Efficient", desc: "No power needed to maintain stored data" },
                  { title: "Compact Size", desc: "All of humanity's data could fit in a small room" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="glow-box bg-muted/30 rounded-xl p-4 border border-border/50 transition-all hover:border-primary/30"
                  >
                    <h4 className="font-display text-sm font-semibold text-primary mb-1" style={{ textShadow: "0 0 8px hsl(185 100% 50% / 0.4)" }}>{item.title}</h4>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Footer */}
        <footer className="text-center py-10 px-4 border-t border-border/30">
          <p className="font-display text-sm text-muted-foreground tracking-wide" style={{ textShadow: "0 0 10px hsl(185 100% 50% / 0.2)" }}>
            DNA-Based Data Storage System
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1 font-body">
            A Bioinformatics Science Project
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
