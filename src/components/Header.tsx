import { motion } from "motion/react";
import ModeToggle from "./mode-toggle";
import { LogOut } from "lucide-react";

export default function Header() {
  const systemOnline = true;

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[25%] max-w-4xl z-50">
      <div className="bg-card/50 backdrop-blur-xl border border-border/20 rounded-full w-full h-[48px] flex items-center justify-between px-6 shadow-md shadow-black/5">
        <h2 className="text-xl font-bold cursor-pointer text-primary transition-colors hover:text-foreground">
          <LogOut className="size-5" />
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <motion.div
              className={`w-2.5 h-2.5 rounded-full ${systemOnline ? 'bg-green-500' : 'bg-destructive'}`}
              animate={{
                scale: systemOnline ? [1, 1.2, 1] : 1,
                opacity: systemOnline ? [0.7, 1, 0.7] : 1,
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <span className="text-[13px] text-muted-foreground hidden sm:inline">
              System Online
            </span>
          </div>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
