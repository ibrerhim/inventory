import { createContext, useContext, useEffect, useState } from "react"

const ThemeProviderContext = createContext({ theme: "dark", setTheme: () => null })

export function ThemeProvider({ children, defaultTheme = "dark", storageKey = "vite-ui-theme" }) {
  const [theme, setTheme] = useState(() => {
    // Try to get the theme from localStorage
    const storedTheme = localStorage.getItem(storageKey)
    // Return stored theme if it exists, otherwise use defaultTheme
    return storedTheme || defaultTheme
  })

  useEffect(() => {
    const root = window.document.documentElement
    
    // Remove both classes first
    root.classList.remove("light", "dark")
    
    // Add the current theme class
    root.classList.add(theme)
    
    // Store the theme preference
    localStorage.setItem(storageKey, theme)
  }, [theme, storageKey])

  const value = {
    theme,
    setTheme: (newTheme) => {
      setTheme(newTheme)
    },
    toggleTheme: () => {
      setTheme(prevTheme => prevTheme === "light" ? "dark" : "light")
    }
  }

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")
    
  return context
}
