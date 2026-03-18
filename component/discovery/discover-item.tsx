import { useRouter } from "next/navigation";
import GlassElement from "../glass-elemet/glass-element";
import { startNewChat } from "@/lib/chat-actions";

type DiscoverPromp = {
  title?: string;
  prompt?: string;
};

export default function DiscoverItem({
  title = "Summarize a document",
  prompt = "Distill long documents into key takeaways",
}: DiscoverPromp) {
  const router = useRouter();

  return (
    <GlassElement className="w-full max-w-md group transition-all duration-150 hover:scale-105 select-none cursor-pointer">
      <div className="p-2 relative">
        <span className="font-semibold text-2xl">{title}</span>
        <p>{prompt}</p>
        <button
          onClick={async () => {
            const id = await startNewChat(prompt);

            if (id) {
              router.push(`/c/${id}`);
            }
          }}
          className="bg-[#505050] hover:bg-[#606060] active:bg-[#404040] cursor-pointer font-semibold px-6 py-2 rounded-full absolute opacity-0 group-hover:opacity-100 transition-all duration-150 delay-100 bottom-0 right-0"
        >
          Use
        </button>
      </div>
    </GlassElement>
  );
}
