"use client";

import { useEffect, useState } from "react";
import Input from "../input";
import Button from "../button";

type AppearanceSettingsData = {
  sidebarOpen: boolean;
  movingBackground: boolean;
};

const STORAGE_KEY = "appearance-settings";

export default function AppearanceSettings() {
  const [settings, setSettings] = useState<AppearanceSettingsData>({
    sidebarOpen: true,
    movingBackground: true,
  });

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem(STORAGE_KEY);

    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  function handleSave() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }

  return (
    <section id="appearance">
      <div className="pb-2 mb-2 border-b border-[#404040]">
        <label className="text-2xl font-medium">Appearance</label>
      </div>

      <form
        className="grid gap-4 md:w-1/2 sm:w-2/3"
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
        <Input
          type="switch"
          label="Sidebar open"
          checked={settings.sidebarOpen}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSettings((prev) => ({
              ...prev,
              sidebarOpen: e.target.checked,
            }))
          }
        />

        <Input
          type="switch"
          label="Moving Background"
          checked={settings.movingBackground}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSettings((prev) => ({
              ...prev,
              movingBackground: e.target.checked,
            }))
          }
        />
        <Button type="submit">Save</Button>
      </form>
    </section>
  );
}
