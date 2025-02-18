import React from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import CryptoScene from "../3d/CryptoScene";
import ParticleBackground from "../effects/ParticleBackground";

interface HeroSectionProps {
  onLogin?: () => void;
  onSignUp?: () => void;
  title?: string;
  subtitle?: string;
}

const HeroSection = ({
  onLogin = () => {},
  onSignUp = () => {},
  title = "Next-Gen Crypto Trading Platform",
  subtitle = "Experience the future of trading with our advanced 3D visualization platform",
}: HeroSectionProps) => {
  return (
    <section className="w-full bg-[#1A1A1A] flex flex-row justify-center items-center relative h-[350px] top-20">
      {/* Particle Background */}
      <ParticleBackground
        particleCount={30}
        connectionDistance={150}
        particleColor="#0052CC"
        lineColor="rgba(0, 82, 204, 0.15)"
      />
      {/* Content Container */}
      <div className="relative w-full max-w-7xl mx-auto px-4">
        <div className="w-full flex flex-col justify-center items-center">
          {/* Text Content */}
          <motion.div
            className="text-center mb-8 relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white drop-shadow-lg">
              {title}
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto font-medium drop-shadow-md">
              {subtitle}
            </p>
          </motion.div>
          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Button
              variant="default"
              size="lg"
              onClick={onLogin}
              className="bg-[#0052CC] hover:bg-[#0043A6] text-white px-8 py-6 text-lg"
            >
              Login
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={onSignUp}
              className="border-[#0052CC] text-[#0052CC] hover:bg-[#0052CC] hover:text-white px-8 py-6 text-lg backdrop-blur-sm bg-white/10"
            >
              Sign Up
            </Button>
          </motion.div>
          {/* 3D Scene */}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
