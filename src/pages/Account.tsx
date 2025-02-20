import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Upload, Save } from "lucide-react";
import { supabase } from "@/lib/supabase";

type VerificationStatus = "not_verified" | "pending" | "verified";

export default function Account() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [verificationStatus, setVerificationStatus] =
    useState<VerificationStatus>("not_verified");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Set initial nickname from user metadata
    setNickname(user.user_metadata?.name || "");

    // Fetch verification status
    const fetchVerificationStatus = async () => {
      const { data, error } = await supabase
        .from("user_verifications")
        .select("status")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Error fetching verification status:", error);
        return;
      }

      if (data) {
        setVerificationStatus(data.status as VerificationStatus);
      }
    };

    fetchVerificationStatus();
  }, [user, navigate]);

  const handleNicknameUpdate = async () => {
    if (!user) return;

    try {
      const { error } = await supabase.auth.updateUser({
        data: { name: nickname },
      });

      if (error) throw error;

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating nickname:", error);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile || !user) return;

    try {
      // Upload file to storage
      const fileExt = selectedFile.name.split(".").pop();
      const filePath = `verification/${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("verifications")
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      // Create or update verification status
      const { error: verificationError } = await supabase
        .from("user_verifications")
        .upsert({
          user_id: user.id,
          status: "pending",
          document_url: filePath,
        });

      if (verificationError) throw verificationError;

      setVerificationStatus("pending");
      setSelectedFile(null);
    } catch (error) {
      console.error("Error uploading verification document:", error);
    }
  };

  const getVerificationBadge = () => {
    switch (verificationStatus) {
      case "verified":
        return <Badge className="bg-green-500">Verified</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      default:
        return <Badge variant="destructive">Not Verified</Badge>;
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white p-6">
      <div className="max-w-2xl mx-auto pt-20">
        <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

        <Card className="p-6 bg-[#1A1A1A]/50 backdrop-blur-md border-white/10 space-y-6 text-white">
          <div className="space-y-2">
            <Label>Nickname</Label>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <Input
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="bg-[#1A1A1A]/50 border-white/10 text-white"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleNicknameUpdate}
                    className="border-white/10 hover:bg-white/5"
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <span>{nickname || "Set your nickname"}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="text-xs text-blue-400 hover:text-blue-300"
                  >
                    Edit
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <div className="p-3 bg-[#1A1A1A]/50 rounded-lg border border-white/10">
              {user.email}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>ID Verification</Label>
              {getVerificationBadge()}
            </div>

            {verificationStatus !== "verified" && (
              <div className="space-y-4">
                <p className="text-sm text-gray-400">
                  Please upload a valid government-issued ID for verification.
                </p>

                {verificationStatus === "not_verified" && (
                  <Button
                    onClick={() => navigate("/verification")}
                    className="bg-[#0052CC] hover:bg-[#0052CC]/90"
                  >
                    Start Verification
                  </Button>
                )}

                {verificationStatus === "pending" && (
                  <p className="text-sm text-yellow-500">
                    Your verification is being processed. This may take 1-2
                    business days.
                  </p>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
