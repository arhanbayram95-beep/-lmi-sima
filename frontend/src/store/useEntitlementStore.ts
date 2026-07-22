import { create } from 'zustand';

export interface EntitlementState {
  isPro: boolean;
  productId: string | null;
  expiresAt: string | null;
  hasSeenPaywall: boolean;
  setEntitlement: (partial: Partial<Pick<EntitlementState, 'isPro' | 'productId' | 'expiresAt'>>) => void;
  markPaywallSeen: () => void;
}

export const useEntitlementStore = create<EntitlementState>()((set) => ({
  isPro: false,
  productId: null,
  expiresAt: null,
  hasSeenPaywall: false,
  setEntitlement: (partial) => set(partial),
  markPaywallSeen: () => set({ hasSeenPaywall: true }),
}));
