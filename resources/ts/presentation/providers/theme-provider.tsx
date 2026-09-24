import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "todo-ui-theme",
}: ThemeProviderProps): React.ReactElement {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") {
      return defaultTheme;
    }
    const stored = window.localStorage.getItem(storageKey);
    if (stored === "dark" || stored === "light" || stored === "system") {
      return stored;
    }
    return defaultTheme;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
      return;
    }
    root.classList.add(theme);
  }, [theme]);

  return (
    <ThemeProviderContext.Provider
      value={{
        theme,
        setTheme: (next) => {
          if (typeof window !== "undefined") {
            window.localStorage.setItem(storageKey, next);
          }
          setTheme(next);
        },
      }}
    >
      {children}
    </ThemeProviderContext.Provider>
  );
}

export function useTheme(): ThemeProviderState {
  const ctx = useContext(ThemeProviderContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
