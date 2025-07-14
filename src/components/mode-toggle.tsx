import { Moon, Sun } from "lucide-react"
import { useTheme } from "./providers/theme-provider"
import { Button } from "./ui/button"

export default function ModeToggle({ className, ...props }: React.ComponentProps<typeof Button>) {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={className}
      {...props}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all duration-[250ms] dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all duration-[250ms] dark:scale-100 dark:rotate-0" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
