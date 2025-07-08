// src/store/accessibilityStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AccessibilitySettings {
  darkMode: boolean;
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'xl';
  reduceMotion: boolean;
  speechEnabled: boolean;
  globalMute: boolean;
  selectedVoice: string; // <-- ADDED
  voiceRate: number;     // <-- ADDED
  voicePitch: number;    // <-- ADDED
}

interface AccessibilityStore {
  settings: AccessibilitySettings;
  updateSettings: (newSettings: Partial<AccessibilitySettings>) => void;
  resetSettings: () => void;
}

export const useAccessibilityStore = create<AccessibilityStore>()(
  persist(
    (set) => ({
      settings: {
        darkMode: false,
        highContrast: false,
        fontSize: 'medium',
        reduceMotion: false,
        speechEnabled: false,
        globalMute: false,
        selectedVoice: '',   // <-- ADDED & INITIALIZED
        voiceRate: 1,        // <-- ADDED & INITIALIZED
        voicePitch: 1,       // <-- ADDED & INITIALIZED
      },
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: {
            ...state.settings,
            ...newSettings,
          },
        })),
      resetSettings: () =>
        set(() => ({
          settings: {
            darkMode: false,
            highContrast: false,
            fontSize: 'medium',
            reduceMotion: false,
            speechEnabled: true,
            globalMute: false,
            selectedVoice: '',    // <-- MODIFIED (added to reset)
            voiceRate: 1,         // <-- MODIFIED (added to reset)
            voicePitch: 1,        // <-- MODIFIED (added to reset)
          },
        })),
    }),
    {
      name: 'accessibility-storage',
      getStorage: () => localStorage,
    }
  )
);