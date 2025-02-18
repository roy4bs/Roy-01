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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      <nav className="fixed top-0 left-0 right-0 h-20 bg-[#1A1A1A]/50 backdrop-blur-md border-b border-white/10 z-50">
        <div className="mx-auto px-4 h-full flex justify-between items-center max-w-[1440px] w-full">
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-white"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-56 bg-[#1A1A1A] border-white/10"
              >
                <DropdownMenuItem onClick={() => navigate("/account")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                  <LogIn className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <span className="font-semibold">Trade</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="pl-8">
                  <Bot className="mr-2 h-4 w-4" />
                  <span>AI Trader</span>
                  <div className="ml-auto text-xs text-muted-foreground">
                    Smart trading with AI
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="pl-8">
                  <Users className="mr-2 h-4 w-4" />
                  <span>Copy Trading</span>
                  <div className="ml-auto text-xs text-muted-foreground">
                    Follow top traders
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/deposit")}>
                  <Upload className="mr-2 h-4 w-4" />
                  <span>Deposit</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/withdrawal")}>
                  <Download className="mr-2 h-4 w-4" />
                  <span>Withdrawal</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/history")}>
                  <History className="mr-2 h-4 w-4" />
                  <span>Transaction History</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full"
              >
                <Avatar className="h-10 w-10 rounded-full bg-[#0052CC]/20">
                  <AvatarFallback className="bg-[#0052CC]/20 text-white">
                    {user.email?.[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.email}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.user_metadata?.name || "User"}
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/account")}>
                <User className="mr-2 h-4 w-4" />
                <span>Account</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                <LogIn className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <span className="font-semibold">Trade</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="pl-8">
                <Bot className="mr-2 h-4 w-4" />
                <span>AI Trader</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="pl-8">
                <Users className="mr-2 h-4 w-4" />
                <span>Copy Trading</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/deposit")}>
                <Upload className="mr-2 h-4 w-4" />
                <span>Deposit</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/withdrawal")}>
                <Download className="mr-2 h-4 w-4" />
                <span>Withdrawal</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/history")}>
                <History className="mr-2 h-4 w-4" />
                <span>Transaction History</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
