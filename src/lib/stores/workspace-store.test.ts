import { describe, it, expect, beforeEach } from "vitest";
import { useWorkspaceStore } from "./workspace-store";

describe("useWorkspaceStore", () => {
  beforeEach(() => {
    useWorkspaceStore.getState().resetWorkspace();
  });

  it("initializes with default state", () => {
    const state = useWorkspaceStore.getState();
    expect(state.isSidebarOpen).toBe(true);
    expect(state.isOfflineSimulated).toBe(false);
  });

  it("toggles sidebar state", () => {
    expect(useWorkspaceStore.getState().isSidebarOpen).toBe(true);
    useWorkspaceStore.getState().toggleSidebar();
    expect(useWorkspaceStore.getState().isSidebarOpen).toBe(false);
    useWorkspaceStore.getState().toggleSidebar();
    expect(useWorkspaceStore.getState().isSidebarOpen).toBe(true);
  });

  it("sets offline simulation state", () => {
    expect(useWorkspaceStore.getState().isOfflineSimulated).toBe(false);
    useWorkspaceStore.getState().setOfflineSimulated(true);
    expect(useWorkspaceStore.getState().isOfflineSimulated).toBe(true);
  });

  it("resets workspace state cleanly", () => {
    useWorkspaceStore.getState().setSidebarOpen(false);
    useWorkspaceStore.getState().setOfflineSimulated(true);
    useWorkspaceStore.getState().resetWorkspace();

    const state = useWorkspaceStore.getState();
    expect(state.isSidebarOpen).toBe(true);
    expect(state.isOfflineSimulated).toBe(false);
  });
});
