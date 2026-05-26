"use client";

import Input from "../input";
import Button from "../button";
import { useSettings } from "@/lib/useSettings";
import { Warning } from "../warning";
import BackgroundSelector from "./background-selector";

export default function AppearanceSettings() {
  const { settings, setSettings } = useSettings();

  return (
    <section id="appearance">
      <div className="pb-2 mb-2 border-b border-[#404040]">
        <label className="text-2xl font-medium">Appearance</label>
      </div>

      <form
        className="grid gap-4"
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
          checked={
            settings.background !== "none"
              ? settings.background.animated
              : false
          }
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSettings((prev) => ({
              ...prev,
              movingBackground: e.target.checked,
            }))
          }
        />
        <BackgroundSelector />
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
        <div className="md:w-1/2 sm:w-2/3">
          <Button type="submit">Save</Button>
        </div>
      </form>
      <div className="flex py-4">
        <Warning message="Give it a moment! If you don't see your changes, try giving the page a quick refresh." />
      </div>
    </section>
  );
}
