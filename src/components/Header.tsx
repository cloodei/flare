import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { LogOut, Wifi, WifiOff } from "lucide-react";
import { useAuthActions } from "@/stores/auth-store";
import { Button } from "./ui/button";
import { fetchWithAuth } from "@/lib/api";
import ModeToggle from "./mode-toggle";

export default function Header() {
  const actions = useAuthActions();
  const navigate = useNavigate();
  const systemOnline = true; // This should be replaced with real-time data

  const handleLogout = async () => {
    try {
      await fetchWithAuth("/logout", { method: "POST" });
    }
    catch (error) {
      console.error("Logout failed:", error);
    }
    finally {
      actions.logout();
      navigate("/auth");
    }
  };

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[90%] sm:w-[400px] max-w-4xl z-50">
      <div className="bg-card/50 backdrop-blur-xl border rounded-full w-full h-[42px] flex items-center justify-between px-4 shadow-md">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start mt-2"
        >
          <LogOut className="mr-2 size-4" />
          Logout
        </Button>

        <div className="flex items-center gap-4">
          <motion.div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-300/70 dark:border-transparent dark:bg-secondary"
            animate={{
              boxShadow: systemOnline ? `0 0 0 4px oklch(from var(--success) l c h / 30%)` : "none",
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          >
            {systemOnline ? (
              <Wifi className="size-3 dark:text-green-400 text-green-500" />
            ) : (
              <WifiOff className="size-3 dark:text-red-500 text-red-400" />
            )}
            <span className="text-xs font-medium">{systemOnline ? "Online" : "Offline"}</span>
          </motion.div>

          <ModeToggle className="max-sm:size-[30px] max-sm:p-0.5" />
        </div>
      </div>
    </header>
  );
}
