import { create } from "zustand";

export interface WorkspaceLayoutState {
  isSidebarOpen: boolean;
  isOfflineSimulated: boolean;

  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setOfflineSimulated: (offline: boolean) => void;
  resetWorkspace: () => void;
}

export const useWorkspaceStore = create<WorkspaceLayoutState>((set) => ({
  isSidebarOpen: true,
  isOfflineSimulated: false,

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen }),
  setOfflineSimulated: (isOfflineSimulated) => set({ isOfflineSimulated }),
  resetWorkspace: () => {
    set({
      isSidebarOpen: true,
      isOfflineSimulated: false,
    });
  },
}));

export const useIsSidebarOpen = () => useWorkspaceStore((state) => state.isSidebarOpen);
export const useIsOfflineSimulated = () => useWorkspaceStore((state) => state.isOfflineSimulated);
