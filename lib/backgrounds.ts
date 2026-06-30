export type BackgroundType = "image" | "video" | "silk" | "none";

export interface BackgroundOption {
  id: string;
  label: string;
  type: BackgroundType;

  variants?: {
    static?: string;
    animated?: string;
  };
}

export const backgrounds: BackgroundOption[] = [
  {
    id: "default",
    label: "Default",
    type: "image",
    variants: {
      static: "/bg.png",
      animated: "/bg-loop.mp4",
    },
  },
  {
    id: "silk",
    label: "Silk",
    type: "silk",
    variants: {
      static: "static",
      animated: "animated",
    },
  },
  {
    id: "none",
    label: "None",
    type: "none",
  },
];
