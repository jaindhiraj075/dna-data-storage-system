import { motion } from "framer-motion";

const colorMap: Record<string, string> = {
  A: "bg-dna-red",
  T: "bg-dna-blue",
  C: "bg-dna-green",
  G: "bg-dna-yellow",
};

const DNABlocks = ({ sequence }: { sequence: string }) => {
  return (
    <div className="flex flex-wrap gap-1.5">
      {sequence.split("").map((base, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: i * 0.01, duration: 0.2 }}
          className={`w-8 h-8 md:w-10 md:h-10 rounded-md flex items-center justify-center text-xs md:text-sm font-bold font-display ${colorMap[base] || "bg-muted"} text-primary-foreground shadow-lg`}
          title={base}
        >
          {base}
        </motion.div>
      ))}
    </div>
  );
};

export default DNABlocks;
