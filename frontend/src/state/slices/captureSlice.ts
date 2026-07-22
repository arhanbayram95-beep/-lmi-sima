import { StateCreator } from 'zustand';

export type ExpressionLabel = 'calm' | 'bright' | 'deep';

// In-memory only, per PROJECT_SPEC.md §3 process-and-discard architecture —
// never persisted, and must be cleared once the backend response returns.
export interface CaptureSlice {
  images: Partial<Record<ExpressionLabel, string>>;
  setImage: (expression: ExpressionLabel, base64: string) => void;
  clearImages: () => void;
}

export const createCaptureSlice: StateCreator<CaptureSlice> = (set) => ({
  images: {},
  setImage: (expression, base64) =>
    set((state) => ({ images: { ...state.images, [expression]: base64 } })),
  clearImages: () => set({ images: {} }),
});
