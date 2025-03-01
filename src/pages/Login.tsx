import LoginForm from "@/components/auth/LoginForm";
import ParticleBackground from "@/components/effects/ParticleBackground";

export default function Login() {
  return (
    <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center p-4 relative">
      <ParticleBackground
        particleCount={30}
        connectionDistance={150}
        particleColor="#0052CC"
        lineColor="rgba(0, 82, 204, 0.15)"
      />
      <LoginForm />
    </div>
  );
}
