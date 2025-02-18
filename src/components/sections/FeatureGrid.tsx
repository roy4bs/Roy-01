import React from "react";
import { motion } from "framer-motion";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { LineChart, Shield, Zap } from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="p-6 bg-[#1A1A1A]/80 backdrop-blur-lg border-[#ffffff1a] hover:border-[#0052CC] transition-colors">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="p-4 rounded-full bg-[#0052CC]/20 text-[#0052CC]">
            {icon}
          </div>
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <p className="text-gray-400">{description}</p>
          <Button
            variant="ghost"
            className="text-[#0052CC] hover:text-[#0052CC]/80"
          >
            Learn More
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

interface FeatureGridProps {
  features?: Array<{
    icon: React.ReactNode;
    title: string;
    description: string;
  }>;
}

const FeatureGrid = ({ features }: FeatureGridProps) => {
  const defaultFeatures = [
    {
      icon: <LineChart size={24} />,
      title: "Advanced Trading",
      description:
        "Access professional-grade trading tools and real-time market data",
    },
    {
      icon: <Shield size={24} />,
      title: "Secure Storage",
      description:
        "Industry-leading security measures to protect your digital assets",
    },
    {
      icon: <Zap size={24} />,
      title: "Instant Execution",
      description: "Lightning-fast trade execution with minimal slippage",
    },
  ];

  const displayFeatures = features || defaultFeatures;

  return (
    <div className="bg-[#1A1A1A] py-20 flex w-full relative h-96 bottom-0 top-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayFeatures.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatureGrid;
