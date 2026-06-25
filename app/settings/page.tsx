"use client";

import SearchInput from "@/components/search-input";
import AccountSettings from "@/components/settings/account";
import AppearanceSettings from "@/components/settings/appearance";
import MemorySettings from "@/components/settings/memory";

export default function SettingsPage() {
  return (
    <div className="h-dvh flex flex-col">
      <header className="w-full py-4 max-md:px-2 flex justify-center bg-[#282828] border-b border-[#404040]">
        <SearchInput value={""} onSearch={function (e: any): void {}} />
      </header>

      <div className="flex-1 overflow-y-auto">
        <main className="md:max-w-6xl max-w-4xl mx-auto p-4 md:p-10 grid gap-8 text-white">
          <AccountSettings />
          <AppearanceSettings />
          <MemorySettings />
        </main>
      </div>
    </div>
  );
}
