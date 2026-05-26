import { useUser } from "@/lib/useUser";
import { useEffect, useMemo, useState } from "react";
import Button from "../button";
import DonutChart from "./donut-chart";

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

  // maximum allowed items
  const MAX_MEMORY_ITEMS = 100;

  useEffect(() => {
    if (!data) return;

    const updatedMemory = {
      chats: data.chats || [],
      images: ["something"],
      videos: ["something"],
    };

    setMemory(updatedMemory);

    const totalItems =
      updatedMemory.chats.length +
      updatedMemory.images.length +
      updatedMemory.videos.length;

    const percentage = Math.min((totalItems / MAX_MEMORY_ITEMS) * 100, 100);

    setMemoryPercentage(Number(percentage.toFixed(1)));
  }, [data]);

  // total used items
  const totalUsed = useMemo(() => {
    return memory.chats.length + memory.images.length + memory.videos.length;
  }, [memory]);

  // percentages for donut chart
  const donutData = useMemo(() => {
    if (totalUsed === 0) {
      return [
        {
          label: "Empty",
          value: 100,
          color: "#404040",
        },
      ];
    }

    return [
      {
        label: "Chats",
        value: (memory.chats.length / totalUsed) * 100,
        color: "#E64C65",
      },
      {
        label: "Images",
        value: (memory.images.length / totalUsed) * 100,
        color: "#11A8AB",
      },
      {
        label: "Videos",
        value: (memory.videos.length / totalUsed) * 100,
        color: "#4FC4F6",
      },
    ];
  }, [memory, totalUsed]);

  return (
    <section id="memory" className="space-y-6">
      <div className="pb-2 border-b border-[#404040]">
        <label className="text-2xl font-medium">Memory</label>
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="w-full h-6 rounded-full overflow-hidden bg-[#606060] relative flex items-center">
          <span
            style={{ width: `${memoryPercentage}%` }}
            className="h-full bg-white transition-all duration-300 absolute left-0 top-0"
          />

          <span className="absolute right-2 font-semibold select-none invert mix-blend-difference text-black">
            {memoryPercentage}%
          </span>
        </div>

        <p className="text-sm text-[#909090]">
          {totalUsed} / {MAX_MEMORY_ITEMS} items used
        </p>
      </div>

      {/* Donut chart + legend */}
      <div className="flex flex-col lg:flex-row items-center gap-8">
        <DonutChart
          centerText={`${memoryPercentage}%`}
          data={donutData}
          size={220}
          thickness={30}
          showLegend={false}
        />

        <ul className="space-y-3 w-full max-w-xs">
          <li className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-4 h-4 rounded-full bg-[#E64C65]" />
              <span>Chats</span>
            </div>

            <span className="text-[#909090]">{memory.chats.length}</span>
          </li>

          <li className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-4 h-4 rounded-full bg-[#11A8AB]" />
              <span>Images</span>
            </div>

            <span className="text-[#909090]">{memory.images.length}</span>
          </li>

          <li className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-4 h-4 rounded-full bg-[#4FC4F6]" />
              <span>Videos</span>
            </div>

            <span className="text-[#909090]">{memory.videos.length}</span>
          </li>
        </ul>
      </div>

      <Button disabled>Delete Chats</Button>
    </section>
  );
}
