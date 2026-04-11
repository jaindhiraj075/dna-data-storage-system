import { useEffect, useRef } from "react";

const DNAHelix = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Particles
    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number }[] = [];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.4 + 0.1,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.015;

      // Draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(200, 100%, 60%, ${p.alpha})`;
        ctx.fill();
      });

      // Connect nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `hsla(200, 100%, 60%, ${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw DNA helix
      const centerX = canvas.width * 0.85;
      const helixHeight = canvas.height;
      const amplitude = 40;
      const steps = 60;

      for (let i = 0; i < steps; i++) {
        const y = (i / steps) * helixHeight;
        const phase = (i / steps) * Math.PI * 6 + time;
        const x1 = centerX + Math.sin(phase) * amplitude;
        const x2 = centerX + Math.sin(phase + Math.PI) * amplitude;
        const z1 = Math.cos(phase);
        const z2 = Math.cos(phase + Math.PI);

        // Rungs
        if (i % 3 === 0) {
          ctx.beginPath();
          ctx.moveTo(x1, y);
          ctx.lineTo(x2, y);
          ctx.strokeStyle = `hsla(200, 80%, 50%, 0.15)`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Strand 1
        const alpha1 = 0.15 + z1 * 0.1;
        ctx.beginPath();
        ctx.arc(x1, y, 3 + z1, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(200, 100%, 60%, ${Math.max(0.05, alpha1)})`;
        ctx.fill();

        // Strand 2
        const alpha2 = 0.15 + z2 * 0.1;
        ctx.beginPath();
        ctx.arc(x2, y, 3 + z2, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(260, 80%, 60%, ${Math.max(0.05, alpha2)})`;
        ctx.fill();
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};

export default DNAHelix;
