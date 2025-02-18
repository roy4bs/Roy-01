import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";
import { LogIn } from "lucide-react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await signIn(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8 p-8 bg-[#1A1A1A]/50 backdrop-blur-md rounded-xl border border-white/10">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white">Welcome back</h2>
        <p className="mt-2 text-sm text-gray-400">Sign in to your account</p>
      </div>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#1A1A1A]/50 border-white/10 text-white"
              required
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#1A1A1A]/50 border-white/10 text-white"
              required
            />
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div>
          <Button
            type="submit"
            className="w-full bg-[#0052CC] hover:bg-[#0052CC]/90"
            disabled={loading}
          >
            <LogIn className="w-4 h-4 mr-2" />
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </div>

        <div className="text-center">
          <Button
            variant="link"
            className="text-[#0052CC]"
            onClick={() => navigate("/signup")}
          >
            Don't have an account? Sign up
          </Button>
        </div>
      </form>
    </div>
  );
}
