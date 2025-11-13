import { create } from "zustand";
import { RefObject } from "react";

interface ScrollStore {
  mainRef: RefObject<HTMLDivElement> | null;
  setMainRef: (ref: RefObject<HTMLDivElement> | null) => void;
  scrollTo: (position: number, behavior?: ScrollBehavior) => void;
}

export const useScrollStore = create<ScrollStore>((set, get) => ({
  mainRef: null,
  setMainRef: (ref) => set({ mainRef: ref }),
  scrollTo: (position, behavior = "smooth") => {
    const { mainRef } = get();
    if (mainRef?.current) {
      mainRef.current.scrollTo({
        top: position,
        behavior,
      });
    }
  },
}));
