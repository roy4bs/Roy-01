import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Copy, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

export default function Deposit() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [walletAddress, setWalletAddress] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchWalletAddress = async () => {
      const { data, error } = await supabase
        .from("wallet_addresses")
        .select("address")
        .single();

      if (error) {
        console.error("Error fetching wallet address:", error);
        return;
      }

      setWalletAddress(data.address);
    };

    fetchWalletAddress();
  }, []);

  const handleCopyAddress = () => {
    try {
      // Create a temporary input element
      const tempInput = document.createElement("input");
      tempInput.value = walletAddress;
      document.body.appendChild(tempInput);

      // Select and copy the text
      tempInput.select();
      document.execCommand("copy");

      // Remove the temporary element
      document.body.removeChild(tempInput);

      toast({
        description: "Wallet address copied to clipboard!",
      });
    } catch (err) {
      console.error("Failed to copy:", err);
      toast({
        variant: "destructive",
        description:
          "Failed to copy address. Please try selecting and copying manually.",
      });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const [amount, setAmount] = useState<string>("");

  const handleConfirmDeposit = async () => {
    if (!selectedFile || !amount) {
      toast({
        variant: "destructive",
        description:
          "Please enter amount and upload a screenshot of your transfer",
      });
      return;
    }

    try {
      // Upload screenshot to storage
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("Not authenticated");

      const fileExt = selectedFile.name.split(".").pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("deposit_screenshots")
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      // Create deposit record
      const { error: depositError } = await supabase.from("deposits").insert({
        user_id: user.id,
        amount: parseFloat(amount),
        screenshot_url: filePath,
        status: "pending",
      });

      if (depositError) throw depositError;

      toast({
        description: "Deposit confirmation submitted successfully!",
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Deposit error:", error);
      toast({
        variant: "destructive",
        description: "Failed to submit deposit. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white p-6">
      <div className="max-w-2xl mx-auto pt-20">
        <Button
          variant="ghost"
          className="mb-6 text-white hover:text-white/80"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card className="p-6 bg-[#1A1A1A]/50 backdrop-blur-md border-white/10">
          <h1 className="text-2xl font-bold mb-6">Deposit USDT</h1>

          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-2 text-[#ffffff]">
                Wallet Address
              </h2>
              <div className="flex items-center space-x-2">
                <code className="flex-1 p-3 bg-black/30 rounded-lg font-mono text-sm bg-[#414141]">
                  {walletAddress}
                </code>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-white/10 hover:bg-white/5"
                  onClick={handleCopyAddress}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Instructions</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-300">
                <li>Copy the wallet address above</li>
                <li>Open your USDT wallet or exchange</li>
                <li>Initiate a transfer to the copied address</li>
                <li>Make sure to use the TRC20 network</li>
                <li>Take a screenshot of the completed transfer</li>
                <li>Upload the screenshot below and confirm your deposit</li>
              </ol>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Amount</h2>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount in USDT"
                className="w-full p-3 bg-black/30 rounded-lg font-mono text-sm bg-[#414141] border border-white/10 focus:outline-none focus:border-[#0052CC]"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Upload Proof</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer border-white/10 bg-black/30 hover:bg-black/20">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-4 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-400">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-400">
                        PNG, JPG (MAX. 10MB)
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
                {previewUrl && (
                  <div className="relative w-full h-64 rounded-lg overflow-hidden">
                    <img
                      src={previewUrl}
                      alt="Transfer proof"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            <Button
              className="w-full bg-[#0052CC] hover:bg-[#0052CC]/90"
              onClick={handleConfirmDeposit}
              disabled={!selectedFile}
            >
              Confirm Deposit
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
