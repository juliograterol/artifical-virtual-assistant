import { useUser } from "@/lib/useUser";
import { useEffect, useState } from "react";

export default function MemorySettings() {
  const { data } = useUser();

  const [memory, setMemory] = useState<{
    chats: any[];
    images: any[];
    videos: any[];
  }>({
    chats: [],
    images: [],
    videos: [],
  });

  const [memoryPercentage, setMemoryPercentage] = useState<number>(0);

  // example maximum storage
  const MAX_MEMORY_ITEMS = 100;

  useEffect(() => {
    if (!data) return;

    const updatedMemory = {
      chats: data.chats || [],
      images: ["something"],
      videos: ["something"],
    };
    console.log(updatedMemory.chats.length);

    setMemory(updatedMemory);

    // calculate total items
    const totalItems =
      updatedMemory.chats.length +
      updatedMemory.images.length +
      updatedMemory.videos.length;

    // convert to percentage
    const percentage = Math.min((totalItems / MAX_MEMORY_ITEMS) * 100, 100);

    setMemoryPercentage(percentage);
  }, [data]);

  return (
    <section id="memory">
      <div className="pb-2 mb-2 border-b border-[#404040]">
        <label className="text-2xl font-medium">Memory</label>
      </div>

      <div className="w-full h-6 rounded-full overflow-hidden bg-[#606060] relative flex items-center">
        <span
          style={{ width: `${memoryPercentage}%` }}
          className="h-full bg-white transition-all duration-150 absolute left-0 top-0"
        />

        <span className="absolute right-2 font-semibold select-none invert mix-blend-difference text-black">
          {memoryPercentage}%
        </span>
      </div>
      <ul className="py-4">
        <li className="flex items-center gap-2">
          <span className="w-4 h-4 bg-white" />
          Chats
        </li>
        <li className="flex items-center gap-2">
          <span className="w-4 h-4 bg-white" />
          Images
        </li>
        <li className="flex items-center gap-2">
          <span className="w-4 h-4 bg-white" />
          Documents
        </li>
      </ul>
    </section>
  );
}
