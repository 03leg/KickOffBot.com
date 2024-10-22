import { create } from "zustand";
import { ThemeDesignerState } from "./store.types";
import { BackgroundColorSchema, WebChatBackgroundDescription } from "@kickoffbot.com/types";

export const useThemeDesignerStore = create<ThemeDesignerState>()(
  (set, get) => ({
    background: {
      schema: BackgroundColorSchema.OneColor,
      color1: "#ffffff",
      color2: "#ffffff",
    },
    setBackground: (background: Partial<WebChatBackgroundDescription>) =>
      set((state) => {
        return {
          background: { ...state.background, ...background },
        };
      }),
  })
);
