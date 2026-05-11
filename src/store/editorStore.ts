import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Filter, FilterSettings, EditorState } from "@/types";

interface EditorStore extends EditorState {
  setUploadedFile: (file: File | null) => void;
  setOriginalUrl: (url: string | null) => void;
  setProcessedUrl: (url: string | null) => void;
  setActiveFilter: (filter: Filter | null) => void;
  updateSettings: (settings: Partial<FilterSettings>) => void;
  resetSettings: () => void;
  setIsProcessing: (processing: boolean) => void;
  pushToHistory: (url: string) => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;
}

const defaultSettings: FilterSettings = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  hue: 0,
  blur: 0,
  sharpen: 0,
  vignette: 0,
  grain: 0,
  temperature: 0,
  tint: 0,
  highlights: 0,
  shadows: 0,
  whites: 0,
  blacks: 0,
};

const initialState: EditorState = {
  uploadedFile: null,
  processedUrl: null,
  originalUrl: null,
  activeFilter: null,
  customSettings: defaultSettings,
  isProcessing: false,
  history: [],
  historyIndex: -1,
};

export const useEditorStore = create<EditorStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setUploadedFile: (file) => set({ uploadedFile: file }),

      setOriginalUrl: (url) => set({ originalUrl: url, processedUrl: url }),

      setProcessedUrl: (url) => set({ processedUrl: url }),

      setActiveFilter: (filter) => set({ activeFilter: filter }),

      updateSettings: (newSettings) =>
        set((state) => ({
          customSettings: { ...state.customSettings, ...newSettings },
        })),

      resetSettings: () => set({ customSettings: defaultSettings, activeFilter: null }),

      setIsProcessing: (processing) => set({ isProcessing: processing }),

      pushToHistory: (url) =>
        set((state) => {
          const newHistory = state.history.slice(0, state.historyIndex + 1);
          newHistory.push(url);
          return {
            history: newHistory.slice(-20),
            historyIndex: newHistory.length - 1,
          };
        }),

      undo: () => {
        const { history, historyIndex } = get();
        if (historyIndex > 0) {
          const prev = history[historyIndex - 1];
          set({ historyIndex: historyIndex - 1, processedUrl: prev });
        }
      },

      redo: () => {
        const { history, historyIndex } = get();
        if (historyIndex < history.length - 1) {
          const next = history[historyIndex + 1];
          set({ historyIndex: historyIndex + 1, processedUrl: next });
        }
      },

      reset: () => set(initialState),
    }),
    { name: "EditorStore" }
  )
);
