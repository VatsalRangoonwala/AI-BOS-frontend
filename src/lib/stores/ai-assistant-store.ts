import { create } from "zustand";

export type AISimulationScenario = "ready" | "offline" | "limit_reached" | "failure";

interface AIAssistantState {
  scenario: AISimulationScenario;
  isGenerating: boolean;
  activeConversationId: string | null;
  isDrawerOpen: boolean;
  selectedActionPrompt: string | null;

  // Actions
  setScenario: (scenario: AISimulationScenario) => void;
  setGenerating: (isGenerating: boolean) => void;
  setActiveConversationId: (id: string | null) => void;
  setDrawerOpen: (open: boolean) => void;
  toggleDrawer: () => void;
  setSelectedActionPrompt: (prompt: string | null) => void;
  resetAssistant: () => void;
}

export const useAIAssistantStore = create<AIAssistantState>((set) => ({
  scenario: "ready",
  isGenerating: false,
  activeConversationId: "conv_001",
  isDrawerOpen: false,
  selectedActionPrompt: null,

  setScenario: (scenario) => set({ scenario }),
  setGenerating: (isGenerating) => set({ isGenerating }),
  setActiveConversationId: (activeConversationId) => set({ activeConversationId }),
  setDrawerOpen: (isDrawerOpen) => set({ isDrawerOpen }),
  toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
  setSelectedActionPrompt: (selectedActionPrompt) => set({ selectedActionPrompt }),
  resetAssistant: () =>
    set({
      scenario: "ready",
      isGenerating: false,
      activeConversationId: "conv_001",
      isDrawerOpen: false,
      selectedActionPrompt: null,
    }),
}));
