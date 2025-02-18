import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./layout/Navbar";
import HeroSection from "./sections/HeroSection";
import FeatureGrid from "./sections/FeatureGrid";
import SupportWidget from "./widgets/SupportWidget";

const Home = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignUp = () => {
    navigate("/signup");
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white relative">
      {/* Navigation */}
      <Navbar onLogin={handleLogin} onSignUp={handleSignUp} />
      {/* Hero Section */}
      <HeroSection
        onLogin={handleLogin}
        onSignUp={handleSignUp}
        className="top-48"
      />
      {/* Feature Grid */}
      <FeatureGrid />
      {/* Support Widget */}
      <SupportWidget />
    </div>
  );
};

export default Home;
