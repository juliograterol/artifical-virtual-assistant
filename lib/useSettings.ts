"use client";

import { useEffect, useState } from "react";

export type AppearanceSettingsData = {
  sidebarOpen: boolean;
  background: { src: string; animated: boolean } | "none";
  chatAnimation: boolean;
  glassEffect: boolean;
};

export const STORAGE_KEY = "appearance-settings";

export const DEFAULT_SETTINGS: AppearanceSettingsData = {
  sidebarOpen: false,
  background: { src: "/bg-loop.mp4", animated: true },
  chatAnimation: true,
  glassEffect: true,
};

export function getSettings(): AppearanceSettingsData {
  if (typeof window === "undefined") {
    return DEFAULT_SETTINGS;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) return DEFAULT_SETTINGS;

    return {
      ...DEFAULT_SETTINGS,
      ...JSON.parse(stored),
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppearanceSettingsData) {
  if (typeof window === "undefined") return;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));

  // trigger same-tab updates
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

    // other tabs
    window.addEventListener("storage", loadSettings);

    // same tab
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
