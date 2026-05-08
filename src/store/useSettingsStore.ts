import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  vimMode: boolean;
  wordWrap: boolean;
  lineNumbers: boolean;
  theme: 'dark' | 'light' | 'system';
  showSettings: boolean;
  toggleVimMode: () => void;
  toggleWordWrap: () => void;
  toggleLineNumbers: () => void;
  setTheme: (theme: 'dark' | 'light' | 'system') => void;
  setShowSettings: (show: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      vimMode: false,
      wordWrap: true,
      lineNumbers: true,
      theme: 'dark',
      showSettings: false,
      toggleVimMode: () => set((state) => ({ vimMode: !state.vimMode })),
      toggleWordWrap: () => set((state) => ({ wordWrap: !state.wordWrap })),
      toggleLineNumbers: () => set((state) => ({ lineNumbers: !state.lineNumbers })),
      setTheme: (theme) => set({ theme }),
      setShowSettings: (show) => set({ showSettings: show }),
    }),
    {
      name: 'md-editor-settings',
      partialize: (state) => ({
        vimMode: state.vimMode,
        wordWrap: state.wordWrap,
        lineNumbers: state.lineNumbers,
        theme: state.theme,
      }), // Persist everything except showSettings
    }
  )
);
