import { motion } from "framer-motion";

const colorMap: Record<string, { bg: string; shadow: string }> = {
  A: { bg: "bg-dna-red", shadow: "0 0 10px hsl(0 85% 55% / 0.6)" },
  T: { bg: "bg-dna-blue", shadow: "0 0 10px hsl(210 100% 55% / 0.6)" },
  C: { bg: "bg-dna-green", shadow: "0 0 10px hsl(145 80% 45% / 0.6)" },
  G: { bg: "bg-dna-yellow", shadow: "0 0 10px hsl(45 100% 55% / 0.6)" },
};

const DNABlocks = ({ sequence }: { sequence: string }) => {
  return (
    <div className="flex flex-wrap gap-1.5">
      {sequence.split("").map((base, i) => {
        const color = colorMap[base] || { bg: "bg-muted", shadow: "none" };
        return (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.01, duration: 0.2 }}
            className={`w-8 h-8 md:w-10 md:h-10 rounded-md flex items-center justify-center text-xs md:text-sm font-bold font-display ${color.bg} text-primary-foreground cursor-default transition-all duration-300 hover:scale-110`}
            style={{ boxShadow: color.shadow }}
            title={base}
          >
            {base}
          </motion.div>
        );
      })}
    </div>
  );
};

export default DNABlocks;
