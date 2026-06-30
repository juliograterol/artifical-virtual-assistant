"use client";

import { useEffect, useState } from "react";

export type BackgroundSettings =
  | "none"
  | {
      id: string;
      animated: boolean;
    };

export type AppearanceSettingsData = {
  sidebarOpen: boolean;
  background: BackgroundSettings;
  chatAnimation: boolean;
  glassEffect: boolean;
};

export const STORAGE_KEY = "appearance-settings";

export const DEFAULT_SETTINGS: AppearanceSettingsData = {
  sidebarOpen: false,
  background: {
    id: "default",
    animated: true,
  },
  chatAnimation: true,
  glassEffect: true,
};

/**
 * Converts old saved backgrounds ({ src, animated })
 * into the new ({ id, animated }) format.
 */
function migrateBackground(background: any): BackgroundSettings {
  if (!background) {
    return DEFAULT_SETTINGS.background;
  }

  if (background === "none") {
    return "none";
  }

  // Already using the new format
  if ("id" in background) {
    return background;
  }

  // Old format -> new format
  if ("src" in background) {
    switch (background.src) {
      case "/bg.png":
      case "/bg-loop.mp4":
        return {
          id: "default",
          animated: background.animated,
        };

      default:
        return DEFAULT_SETTINGS.background;
    }
  }

  return DEFAULT_SETTINGS.background;
}

export function getSettings(): AppearanceSettingsData {
  if (typeof window === "undefined") {
    return DEFAULT_SETTINGS;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) return DEFAULT_SETTINGS;

    const parsed = JSON.parse(stored);

    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      background: migrateBackground(parsed.background),
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppearanceSettingsData) {
  if (typeof window === "undefined") return;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));

  window.dispatchEvent(new Event("appearance-settings-update"));
}

export function useSettings() {
  const [settings, setSettings] =
    useState<AppearanceSettingsData>(DEFAULT_SETTINGS);

  useEffect(() => {
    const loadSettings = () => {
      setSettings(getSettings());
    };

    loadSettings();

    window.addEventListener("storage", loadSettings);
    window.addEventListener("appearance-settings-update", loadSettings);

    return () => {
      window.removeEventListener("storage", loadSettings);
      window.removeEventListener("appearance-settings-update", loadSettings);
    };
  }, []);

  const updateSettings = (
    value:
      | AppearanceSettingsData
      | ((prev: AppearanceSettingsData) => AppearanceSettingsData),
  ) => {
    const newSettings = typeof value === "function" ? value(settings) : value;

    setSettings(newSettings);

    saveSettings(newSettings);
  };

  return {
    settings,
    setSettings: updateSettings,
  };
}
