import { useEffect, useMemo, useState } from "react";
import useMediaMatch from "./useMediaMatch";

type Theme = "light" | "dark";

function getTheme(): Theme | undefined {
  if (typeof window === "undefined") return undefined;

  const theme = window.localStorage.getItem("theme") as Theme;
  return theme || undefined;
}

function saveTheme(theme: Theme) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem("theme", theme);
}

function useTheme(): [Theme, (theme: Theme) => void] {
  const prefersDark = useMediaMatch("(prefers-color-scheme: dark)", false);

  const [theme, setTheme] = useState<Theme>(
    getTheme() || (prefersDark ? "dark" : "light")
  );

  function choseTheme(theme: Theme) {
    saveTheme(theme);
    setTheme(theme);
  }

  useEffect(() => {
    const chosenTheme = getTheme();
    if (chosenTheme === "dark" || (chosenTheme === undefined && prefersDark)) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [prefersDark, theme]);

  return useMemo(() => [theme, choseTheme], [theme]);
}

export default useTheme;
