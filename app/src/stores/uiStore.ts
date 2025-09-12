import { create } from 'zustand';

interface UIState {
  isNavigationReady: boolean;
  isOnboarding: boolean;
  activeTabIndex: number;
  setNavigationReady: (ready: boolean) => void;
  setOnboarding: (onboarding: boolean) => void;
  setActiveTabIndex: (index: number) => void;
}

export const useUIStore = create<UIState>(set => ({
  isNavigationReady: false,
  isOnboarding: false,
  activeTabIndex: 0,
  setNavigationReady: ready => set({ isNavigationReady: ready }),
  setOnboarding: onboarding => set({ isOnboarding: onboarding }),
  setActiveTabIndex: index => set({ activeTabIndex: index }),
}));
