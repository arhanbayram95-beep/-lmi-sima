import { create } from 'zustand';

export type ExpressionStep = 'calm' | 'bright' | 'deep';

export interface CaptureState {
  calmImageUri: string | null;
  brightImageUri: string | null;
  deepImageUri: string | null;
  setImage: (step: ExpressionStep, uri: string) => void;
  clearAll: () => void;
}

const STEP_KEY: Record<ExpressionStep, keyof CaptureState> = {
  calm: 'calmImageUri',
  bright: 'brightImageUri',
  deep: 'deepImageUri',
};

// Never wrap this store in `persist` — captured images must not survive a
// process restart or reach disk, per the process-and-discard architecture
// in PROJECT_SPEC.md §3.
export const useCaptureStore = create<CaptureState>()((set) => ({
  calmImageUri: null,
  brightImageUri: null,
  deepImageUri: null,
  setImage: (step, uri) => set({ [STEP_KEY[step]]: uri }),
  clearAll: () => set({ calmImageUri: null, brightImageUri: null, deepImageUri: null }),
}));
