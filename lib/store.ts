"use client";

import { create } from "zustand";

interface AppStore {
  activeProjectId: string | null;
  activeProjectColor: string;
  activeProjectName: string;
  setActiveProject: (id: string, color: string, name: string) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  activeProjectId: null,
  activeProjectColor: "#6366f1",
  activeProjectName: "",

  setActiveProject: (id, color, name) =>
    set({
      activeProjectId: id,
      activeProjectColor: color,
      activeProjectName: name,
    }),
}));