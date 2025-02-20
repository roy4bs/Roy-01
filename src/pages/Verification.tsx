import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload } from "lucide-react";
import { supabase } from "@/lib/supabase";

type IdType = "drivers_license" | "personal_id" | "passport";

export default function Verification() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form fields
  const [legalName, setLegalName] = useState("");
  const [nationality, setNationality] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [idType, setIdType] = useState<IdType | "">("");
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [address, setAddress] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !frontFile || !backFile || !idType) return;

    setIsSubmitting(true);
    try {
      // Upload front ID image
      const frontExt = frontFile.name.split(".").pop();
      const frontPath = `verification/${user.id}/front_${Date.now()}.${frontExt}`;
      const { error: frontError } = await supabase.storage
        .from("verifications")
        .upload(frontPath, frontFile);
      if (frontError) throw frontError;

      // Upload back ID image
      const backExt = backFile.name.split(".").pop();
      const backPath = `verification/${user.id}/back_${Date.now()}.${backExt}`;
      const { error: backError } = await supabase.storage
        .from("verifications")
        .upload(backPath, backFile);
      if (backError) throw backError;

      // Create verification record
      const { error: verificationError } = await supabase
        .from("user_verifications")
        .upsert({
          user_id: user.id,
          status: "pending",
          legal_name: legalName,
          nationality,
          date_of_birth: dateOfBirth,
          id_type: idType,
          id_front_url: frontPath,
          id_back_url: backPath,
          residential_address: address,
        });

      if (verificationError) throw verificationError;

      // Redirect to account page
      navigate("/account");
    } catch (error) {
      console.error("Error submitting verification:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white p-6">
      <div className="max-w-2xl mx-auto pt-20">
        <h1 className="text-3xl font-bold mb-8">ID Verification</h1>

        <Card className="p-6 bg-[#1A1A1A]/50 backdrop-blur-md border-white/10 text-white">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Legal Name (as shown on ID)</Label>
              <Input
                required
                value={legalName}
                onChange={(e) => setLegalName(e.target.value)}
                className="bg-[#1A1A1A]/50 border-white/10 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label>Nationality</Label>
              <Input
                required
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                className="bg-[#1A1A1A]/50 border-white/10 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label>Date of Birth</Label>
              <Input
                required
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="bg-[#1A1A1A]/50 border-white/10 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label>Type of ID</Label>
              <Select
                required
                value={idType}
                onValueChange={(value: IdType) => setIdType(value)}
              >
                <SelectTrigger className="bg-[#1A1A1A]/50 border-white/10 text-white">
                  <SelectValue placeholder="Select ID type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="drivers_license">
                    Driver's License
                  </SelectItem>
                  <SelectItem value="personal_id">Personal ID</SelectItem>
                  <SelectItem value="passport">Passport</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Front of ID</Label>
              <Input
                required
                type="file"
                accept="image/*"
                onChange={(e) => setFrontFile(e.target.files?.[0] || null)}
                className="bg-[#1A1A1A]/50 border-white/10 text-white bg-[#2d2d2d]"
              />
            </div>

            <div className="space-y-2">
              <Label>Back of ID</Label>
              <Input
                required
                type="file"
                accept="image/*"
                onChange={(e) => setBackFile(e.target.files?.[0] || null)}
                className="bg-[#1A1A1A]/50 border-white/10 text-white bg-[--2d2d2d-] bg-[#2b2b2b]"
              />
            </div>

            <div className="space-y-2">
              <Label>Residential Address</Label>
              <Input
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="bg-[#1A1A1A]/50 border-white/10 text-white"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#0052CC] hover:bg-[#0052CC]/90"
            >
              {isSubmitting ? (
                "Submitting..."
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Submit Verification
                </>
              )}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
