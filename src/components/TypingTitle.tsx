import { useState, useEffect } from "react";

const TypingTitle = ({ text }: { text: string }) => {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, 70);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold tracking-wider text-foreground">
      {displayed}
      <span
        className={`inline-block w-0.5 h-8 md:h-12 ml-1 align-middle bg-primary ${done ? "animate-pulse" : ""}`}
      />
    </h1>
  );
};

export default TypingTitle;
