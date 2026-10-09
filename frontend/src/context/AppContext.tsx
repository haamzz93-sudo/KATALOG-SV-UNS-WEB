"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "../types/catalog";
import { getStoredUser, removeToken, setStoredUser } from "../lib/api";

interface AppContextType {
  currentLang: "id" | "en";
  setLang: (lang: "id" | "en") => void;
  toggleLang: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLang, setCurrentLang] = useState<"id" | "en">("id");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false); // Default Light Mode bersih
  const [currentUser, setCurrentUserState] = useState<User | null>(null);

  useEffect(() => {
    // Default WAJIB Light Mode:
    try {
      localStorage.removeItem("vokasi_theme");
      localStorage.removeItem("vokasi_theme_v2");
      const savedTheme = localStorage.getItem("vokasi_theme_v3");
      const isDark = savedTheme === "dark";

      if (isDark) {
        setIsDarkMode(true);
        document.documentElement.classList.add("dark");
      } else {
        setIsDarkMode(false);
        document.documentElement.classList.remove("dark");
        localStorage.setItem("vokasi_theme_v3", "light");
      }
    } catch {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }

    // Check saved language
    const savedLang = localStorage.getItem("vokasi_lang");
    if (savedLang === "en" || savedLang === "id") {
      setCurrentLang(savedLang);
    }

    // Check saved user
    const user = getStoredUser();
    if (user) {
      setCurrentUserState(user);
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("vokasi_theme_v3", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("vokasi_theme_v3", "light");
      }
      return next;
    });
  };

  const setLang = (lang: "id" | "en") => {
    setCurrentLang(lang);
    localStorage.setItem("vokasi_lang", lang);
  };

  const toggleLang = () => {
    const next = currentLang === "id" ? "en" : "id";
    setLang(next);
  };

  const setCurrentUser = (user: User | null) => {
    setCurrentUserState(user);
    if (user) {
      setStoredUser(user);
    } else {
      removeToken();
    }
  };

  const logout = () => {
    removeToken();
    setCurrentUserState(null);
  };

  return (
    <AppContext.Provider
      value={{
        currentLang,
        setLang,
        toggleLang,
        isDarkMode,
        toggleTheme,
        currentUser,
        setCurrentUser,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
