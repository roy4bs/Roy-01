import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import AccountInfo from "@/components/dashboard/AccountInfo";
import { Button } from "@/components/ui/button";
import {
  Bot,
  Download,
  History,
  LogIn,
  LogOut,
  Menu,
  Settings,
  Upload,
  User,
  Users,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (!user) return null;

  interface MenuItemProps {
    icon?: React.ComponentType<{ className?: string }>;
    label: string;
    onClick?: () => void;
    description?: string;
    indent?: boolean;
  }

  const MenuItem: React.FC<MenuItemProps> = ({
    icon: Icon,
    label,
    onClick,
    description,
    indent = false,
  }) => (
    <button
      className={`w-full flex items-center gap-2 p-3 text-sm text-white hover:bg-white/5 transition-colors ${indent ? "pl-8" : ""}`}
      onClick={onClick}
    >
      {Icon && <Icon className="h-4 w-4" />}
      <div className="flex-1 text-left">
        <div>{label}</div>
        {description && (
          <div className="text-xs text-gray-400">{description}</div>
        )}
      </div>
    </button>
  );

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      <nav className="fixed top-0 left-0 right-0 h-20 bg-[#1A1A1A]/50 backdrop-blur-md border-b border-white/10 z-50">
        <div className="mx-auto px-4 h-full flex justify-between items-center max-w-[1440px] w-full">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
              TradeAI
            </h1>
            <div className="hidden md:flex items-center gap-2">
              <Button
                variant="default"
                className="bg-[#0052CC] hover:bg-[#0052CC]/90"
                onClick={() => navigate("/deposit")}
              >
                Deposit
              </Button>
              <Button
                variant="outline"
                className="border-white/10 text-white hover:bg-white/5 bg-[#1A1A1A]"
                onClick={() => {}}
              >
                Trade
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10 rounded-full bg-[#0052CC]/20">
              <AvatarFallback className="bg-[#0052CC]/20 text-white">
                {user.email?.[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-80 bg-[#1A1A1A] border-l border-white/10 p-0">
                <SheetHeader className="p-6 text-left">
                  <SheetTitle className="text-white">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10 rounded-full bg-[#0052CC]/20">
                        <AvatarFallback className="bg-[#0052CC]/20 text-white">
                          {user.email?.[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {user.email}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {user.user_metadata?.name || "User"}
                        </span>
                      </div>
                    </div>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col">
                  <MenuItem
                    icon={User}
                    label="Account"
                    onClick={() => navigate("/account")}
                  />
                  <MenuItem
                    icon={LogIn}
                    label="Dashboard"
                    onClick={() => navigate("/dashboard")}
                  />
                  <Separator className="my-2 bg-white/10" />
                  <div className="px-3 py-2 text-sm font-semibold text-white">
                    Trade
                  </div>
                  <MenuItem
                    icon={Bot}
                    label="AI Trader"
                    description="Smart trading with AI"
                    indent
                  />
                  <MenuItem
                    icon={Users}
                    label="Copy Trading"
                    description="Follow top traders"
                    indent
                  />
                  <Separator className="my-2 bg-white/10" />
                  <MenuItem
                    icon={Upload}
                    label="Deposit"
                    onClick={() => navigate("/deposit")}
                  />
                  <MenuItem
                    icon={Download}
                    label="Withdrawal"
                    onClick={() => navigate("/withdrawal")}
                  />
                  <MenuItem
                    icon={History}
                    label="Transaction History"
                    onClick={() => navigate("/history")}
                  />
                  <Separator className="my-2 bg-white/10" />
                  <MenuItem
                    icon={Settings}
                    label="Settings"
                    onClick={() => navigate("/settings")}
                  />
                  <MenuItem
                    icon={LogOut}
                    label="Log out"
                    onClick={handleSignOut}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
      <main className="pt-32 px-4">
        <div className="max-w-7xl mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <AccountInfo funds={1000} />
          {/* Add more dashboard components here */}
        </div>
      </main>
    </div>
  );
}
