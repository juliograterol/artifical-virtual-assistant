"use client";

import { useEffect, useState } from "react";
import Input from "../input";
import Button from "../button";

type AppearanceSettingsData = {
  sidebarOpen: boolean;
  movingBackground: boolean;
  chatAnimation: boolean;
  glassEffect: boolean;
};

const STORAGE_KEY = "appearance-settings";

export default function AppearanceSettings() {
  const [settings, setSettings] = useState<AppearanceSettingsData>({
    sidebarOpen: false,
    movingBackground: false,
    chatAnimation: false,
    glassEffect: false,
  });

  // Load saved settings
  useEffect(() => {
    const savedSettings = localStorage.getItem(STORAGE_KEY);

    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save automatically
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  return (
    <section id="appearance">
      <div className="pb-2 mb-2 border-b border-[#404040]">
        <label className="text-2xl font-medium">Appearance</label>
      </div>

      <form
        className="grid gap-4 md:w-1/2 sm:w-2/3"
        onSubmit={(e) => {
          e.preventDefault();
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
        <Input
          type="switch"
          label="Chat Animation"
          checked={settings.chatAnimation}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSettings((prev) => ({
              ...prev,
              chatAnimation: e.target.checked,
            }))
          }
        />
        <Input
          type="switch"
          label="Glass Effect"
          checked={settings.glassEffect}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSettings((prev) => ({
              ...prev,
              glassEffect: e.target.checked,
            }))
          }
        />
        <Button type="submit">Save</Button>
      </form>
    </section>
  );
}
