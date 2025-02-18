import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface ParticleBackgroundProps {
  particleCount?: number;
  connectionDistance?: number;
  particleColor?: string;
  lineColor?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const ParticleBackground = ({
  particleCount = 50,
  connectionDistance = 150,
  particleColor = "#0052CC",
  lineColor = "rgba(0, 82, 204, 0.15)",
}: ParticleBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const initParticles = () => {
      particles.current = [];
      for (let i = 0; i < particleCount; i++) {
        particles.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
        });
      }
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw particles
      particles.current.forEach((particle) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.fill();

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off walls
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
      });

      // Draw connections
      particles.current.forEach((particle, i) => {
        particles.current.slice(i + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = 1 - distance / connectionDistance;
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(drawParticles);
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    initParticles();
    drawParticles();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [particleCount, connectionDistance, particleColor, lineColor]);

  return (
    <motion.div
      className="fixed bg-[#1A1A1A] z-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </motion.div>
  );
};

export default ParticleBackground;
