"use client";

import { create } from "zustand";

interface AppStore {
  activeProjectId: string | null;
  setActiveProjectId: (id: string) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  activeProjectId: null,

  setActiveProjectId: (id) =>
    set({
      activeProjectId: id,
    }),
}));