import { Card } from "@/components/ui/card";
import { Wallet } from "lucide-react";

interface AccountInfoProps {
  funds?: number;
}

export default function AccountInfo({ funds = 0 }: AccountInfoProps) {
  return (
    <Card className="p-6 bg-[#1A1A1A]/80 backdrop-blur-lg border-[#ffffff1a]">
      <div className="flex items-center space-x-4">
        <div className="p-3 rounded-full bg-[#0052CC]/20">
          <Wallet className="w-6 h-6 text-[#0052CC]" />
        </div>
        <div>
          <p className="text-sm text-gray-400">Available Balance</p>
          <h3 className="text-2xl font-bold text-white">
            ${funds.toFixed(2)} USDT
          </h3>
        </div>
      </div>
    </Card>
  );
}
