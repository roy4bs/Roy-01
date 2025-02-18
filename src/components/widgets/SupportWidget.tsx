import React from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

interface SupportWidgetProps {
  whatsappNumber?: string;
  isOpen?: boolean;
  onToggle?: () => void;
}

const SupportWidget = ({
  whatsappNumber = "+1234567890",
  isOpen = false,
  onToggle = () => {},
}: SupportWidgetProps) => {
  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/${whatsappNumber}`, "_blank");
  };

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="fixed bottom-6 right-6 z-50 bg-[#1A1A1A]"
    >
      <Button
        onClick={handleWhatsAppClick}
        className="w-16 h-16 rounded-full bg-[#0052CC] hover:bg-[#0052CC]/90 shadow-lg
          backdrop-blur-md bg-opacity-85 border border-white/10"
        size="icon"
      >
        <MessageCircle className="w-8 h-8 text-white" />
      </Button>
    </motion.div>
  );
};

export default SupportWidget;
