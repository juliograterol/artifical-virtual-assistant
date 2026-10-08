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
    id: "sand",
    label: "Sand",
    type: "image",
    variants: {
      static: "/bg.png",
      animated: "/bg-loop.mp4",
    },
  },
  {
    id: "default",
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
