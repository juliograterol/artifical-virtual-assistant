import { useRouter } from "next/navigation";
import GlassElement from "../glass-elemet/glass-element";
import { startNewChat } from "@/lib/chat-actions";
import { showAlert } from "@/lib/show-alert";
import UsePrompt, { PromptProps } from "./use-prompt";

type DiscoverPromp = PromptProps;

export default function DiscoverItem(item: DiscoverPromp) {
  const router = useRouter();
  const { title, description, prompt } = item;

  return (
    <GlassElement className="w-full max-w-md group transition-all duration-150 hover:scale-105 select-none cursor-pointer">
      <div
        className="p-2 relative"
        onClick={async () => {
          await showAlert({
            form: (
              <UsePrompt
                item={item}
                onUse={(id) => {
                  router.push(`/c/${id}`);
                }}
              />
            ),
          });
        }}
      >
        <span className="font-semibold text-2xl">{title}</span>
        <p className="line-clamp-2">{description}</p>
        <button
          // onClick={() => showAlert({ title: "Prompt", message: "message" })}
          className="bg-[#505050] hover:bg-[#606060] active:bg-[#404040] cursor-pointer font-semibold px-6 py-2 rounded-full absolute opacity-0 group-hover:opacity-100 transition-all duration-150 delay-100 bottom-0 right-0"
        >
          Use
        </button>
      </div>
    </GlassElement>
  );
}
