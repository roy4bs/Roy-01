import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Lock, KeyRound, Shield } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function Settings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Login Management
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Advanced Settings
  const [withdrawalPassword, setWithdrawalPassword] = useState("");
  const [confirmWithdrawalPassword, setConfirmWithdrawalPassword] =
    useState("");
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      // Clear password fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      alert("Password updated successfully");
    } catch (error) {
      console.error("Error updating password:", error);
      alert("Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdrawalPasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawalPassword !== confirmWithdrawalPassword) {
      alert("Withdrawal passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.from("user_settings").upsert({
        user_id: user?.id,
        withdrawal_password: withdrawalPassword, // Note: In production, hash this password
      });

      if (error) throw error;

      // Clear withdrawal password fields
      setWithdrawalPassword("");
      setConfirmWithdrawalPassword("");
      alert("Withdrawal password updated successfully");
    } catch (error) {
      console.error("Error updating withdrawal password:", error);
      alert("Failed to update withdrawal password");
    } finally {
      setIsLoading(false);
    }
  };

  const handle2FAToggle = async (enabled: boolean) => {
    setIsLoading(true);
    try {
      // Implement 2FA setup/disable logic here
      setIs2FAEnabled(enabled);
    } catch (error) {
      console.error("Error toggling 2FA:", error);
      alert("Failed to update 2FA settings");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white p-6">
      <div className="max-w-2xl mx-auto pt-20">
        <h1 className="text-3xl font-bold mb-8">Security Settings</h1>

        {/* Login Management */}
        <Card className="p-6 bg-[#1A1A1A]/50 backdrop-blur-md border-white/10 mb-6 text-white">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Login Management
          </h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <div className="p-3 bg-[#1A1A1A]/50 rounded-lg border border-white/10">
                {user.email}
              </div>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <Label>Current Password</Label>
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="bg-[#1A1A1A]/50 border-white/10 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>New Password</Label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-[#1A1A1A]/50 border-white/10 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Confirm New Password</Label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-[#1A1A1A]/50 border-white/10 text-white"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#0052CC] hover:bg-[#0052CC]/90"
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </div>
        </Card>

        {/* Advanced Settings */}
        <Card className="p-6 bg-[#1A1A1A]/50 backdrop-blur-md border-white/10 text-white">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Advanced Settings
          </h2>

          <div className="space-y-6">
            <form
              onSubmit={handleWithdrawalPasswordChange}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label>Set Withdrawal Password</Label>
                <Input
                  type="password"
                  value={withdrawalPassword}
                  onChange={(e) => setWithdrawalPassword(e.target.value)}
                  className="bg-[#1A1A1A]/50 border-white/10 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Confirm Withdrawal Password</Label>
                <Input
                  type="password"
                  value={confirmWithdrawalPassword}
                  onChange={(e) => setConfirmWithdrawalPassword(e.target.value)}
                  className="bg-[#1A1A1A]/50 border-white/10 text-white"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#0052CC] hover:bg-[#0052CC]/90"
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Set Withdrawal Password"}
              </Button>
            </form>

            <Separator className="my-4 bg-white/10" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication (2FA)</Label>
                  <div className="text-sm text-gray-400">
                    Secure your account with 2FA
                  </div>
                </div>
                <Switch
                  checked={is2FAEnabled}
                  onCheckedChange={handle2FAToggle}
                  disabled={isLoading}
                />
              </div>

              {is2FAEnabled && (
                <div className="p-4 bg-[#0052CC]/20 rounded-lg border border-[#0052CC]/30">
                  <p className="text-sm">
                    2FA is enabled. Use an authenticator app to generate codes.
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
