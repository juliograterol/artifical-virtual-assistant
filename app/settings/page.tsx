"use client";

import Input from "@/component/input";
import SearchInput from "@/component/search-input";

export default function SettingsPage() {
  return (
    <div className="h-dvh flex flex-col">
      <header className="w-ful py-4 flex justify-center bg-[#282828] border-b border-[#404040]">
        <SearchInput value={""} onSearch={function (e: any): void {}} />
      </header>
      <main className="w-full md:p-10 p-4 grid gap-4 text-white overflow-y-auto flex-1">
        <section id="account-settings">
          <div className="pb-2 mb-2 border-b border-[#404040]">
            <label className="text-2xl font-medium">Account Settings</label>
          </div>
          <form
            className="grid gap-4 md:w-1/2 sm:w-2/3"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <label>User's information</label>
            <Input placeholder="Name" />
            <Input placeholder="Last Name" />
            <button
              className="w-min px-4 py-2 rounded bg-[#606060] cursor-pointer"
              type="submit"
            >
              Save
            </button>
          </form>
        </section>
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
            <Input type="switch" label="Sidebar open" />
            <Input type="switch" label="Moving Background" />
            <button
              className="w-min px-4 py-2 rounded bg-[#606060] cursor-pointer"
              type="submit"
            >
              Save
            </button>
          </form>
        </section>
        <section id="memory">
          <div className="pb-2 mb-2 border-b border-[#404040]">
            <label className="text-2xl font-medium">Memory</label>
          </div>
          Nothing yet.
        </section>
      </main>
    </div>
  );
}
