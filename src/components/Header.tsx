import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { LogOut, Wifi, WifiOff } from "lucide-react";
import { out } from "@/lib/api";
import { Button } from "./ui/button";
import { usePiOnline } from "@/stores/controls-store";
import { useAuthActions } from "@/stores/auth-store";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import ModeToggle from "./mode-toggle";

export default function Header() {
  const systemOnline = usePiOnline();

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[90%] sm:w-[400px] max-w-4xl z-50">
      <div className="bg-card/50 backdrop-blur-xl border rounded-full w-full h-[42px] flex items-center justify-between px-4 shadow-md">
        <LogoutButton />

        <div className="flex items-center gap-4">
          <motion.div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-300/70 dark:border-transparent dark:bg-secondary"
            animate={{
              boxShadow: systemOnline ? `0 0 0 4px oklch(from var(--success) l c h / 30%)` : undefined,
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

function LogoutButton() {
  const { logout } = useAuthActions();
  const navigate = useNavigate();

  function handleLogout() {
    out().then(() => {
      logout();
      navigate("/auth");
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <LogOut className="size-4 cursor-pointer transition-colors duration-200 dark:hover:text-rose-400 hover:text-rose-500" />
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Đăng xuất</DialogTitle>

          <DialogDescription>
            Bạn có chắc chắn muốn đăng xuất?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Hủy</Button>
          </DialogClose>

          <Button onClick={handleLogout}>Đăng xuất</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
