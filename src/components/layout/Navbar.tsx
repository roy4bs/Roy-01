import React from "react";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus } from "lucide-react";

interface NavbarProps {
  logo?: string;
  onLogin?: () => void;
  onSignUp?: () => void;
}

const Navbar = ({
  logo = "CryptoTrade",
  onLogin = () => console.log("Login clicked"),
  onSignUp = () => console.log("Sign up clicked"),
}: NavbarProps) => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-20 bg-[#1A1A1A]/50 backdrop-blur-md border-b border-white/10 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
              {logo}
            </h1>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10"
              onClick={onLogin}
            >
              <LogIn className="w-4 h-4 mr-2" />
              Login
            </Button>
            <Button
              className="bg-[#0052CC] hover:bg-[#0052CC]/90"
              onClick={onSignUp}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
