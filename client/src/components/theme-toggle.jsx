import { Moon, Sun } from "lucide-react"
import { Button } from "./ui/button"
import { useTheme } from "./theme-provider"

export function ThemeToggle({ variant = "outline", size = "icon" }) {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button 
      variant={variant} 
      size={size} 
      onClick={toggleTheme}
      title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
    >
      {theme === "light" ? (
        <Moon className="h-[1.2rem] w-[1.2rem] rotate-90 transition-all dark:rotate-0" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 transition-all dark:-rotate-90" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
