'use client';

import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import type { AppState, CurrentUser } from './types';
import { PropsWithChildren } from 'react';

const VERSION = 1;

const baseStore = (set: any): AppState => ({
  currentUser: null,

  setCurrentUser: (u: NonNullable<CurrentUser>) =>
    set({ currentUser: u }),

  updateCurrentUser: (patch: Partial<NonNullable<CurrentUser>>) =>
    set((s: AppState) => (s.currentUser ? { currentUser: { ...s.currentUser, ...patch } } : {})),

  clearCurrentUser: () => set({ currentUser: null }),
});

// Only persist a safe subset
const persistConfig = {
  name: 'app-store',
  version: VERSION,
  // Persist the whole currentUser object (no tokens here)
  partialize: (s: AppState): Partial<AppState> => ({ currentUser: s.currentUser }),
  storage: createJSONStorage(() => {
    if (typeof window !== 'undefined') return localStorage;
    // no-op storage for SSR
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    } as any;
  }),
  migrate: (persisted: any) => persisted,
};

const withDevtools = (fn: any) =>
  process.env.NODE_ENV === 'development' ? devtools(fn, { name: 'app-store' }) : fn;

export const useAppStore = create<AppState>()(
  withDevtools(persist(baseStore as any, persistConfig))
);

// Optional provider (kept for API compatibility)
export function AppStoreProvider({ children }: PropsWithChildren) {
  return children as any;
}
