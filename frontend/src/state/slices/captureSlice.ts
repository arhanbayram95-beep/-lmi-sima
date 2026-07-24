import { StateCreator } from 'zustand';
import { ReadingModuleId } from '../../api/types';

export type ExpressionLabel = 'calm' | 'bright' | 'deep';

// In-memory only, per PROJECT_SPEC.md §3 process-and-discard architecture —
// never persisted, and must be cleared once the backend response returns.
export interface CaptureSlice {
  images: Partial<Record<ExpressionLabel, string>>;
  setImage: (expression: ExpressionLabel, base64: string) => void;
  clearImages: () => void;
  // Which reading module the current capture session is for — set by
  // AnalyzeScreen before navigating into capture, read by AnalyzingScreen
  // when it calls the backend. Defaults to the original module so any
  // screen that skips selection (e.g. a future direct-entry point) still
  // gets a sensible reading.
  selectedModule: ReadingModuleId;
  setSelectedModule: (module: ReadingModuleId) => void;
}

export const createCaptureSlice: StateCreator<CaptureSlice> = (set) => ({
  images: {},
  setImage: (expression, base64) =>
    set((state) => ({ images: { ...state.images, [expression]: base64 } })),
  clearImages: () => set({ images: {} }),
  selectedModule: 'three-expression',
  setSelectedModule: (module) => set({ selectedModule: module }),
});
