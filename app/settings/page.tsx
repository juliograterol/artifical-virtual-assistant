"use client";

import SearchInput from "@/component/search-input";
import AccountSettings from "@/component/settings/account";
import AppearanceSettings from "@/component/settings/appearance";
import MemorySettings from "@/component/settings/memory";

export default function SettingsPage() {
  return (
    <div className="h-dvh flex flex-col">
      <header className="w-ful py-4 flex justify-center bg-[#282828] border-b border-[#404040]">
        <SearchInput value={""} onSearch={function (e: any): void {}} />
      </header>
      <main className="w-full md:p-10 p-4 grid gap-4 text-white overflow-y-auto flex-1">
        <AccountSettings />
        <AppearanceSettings />
        <MemorySettings />
      </main>
    </div>
  );
}
