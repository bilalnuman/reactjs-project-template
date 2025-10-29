import type { AppState } from './types';

export const selectCurrentUser = (s: AppState) => s.currentUser;
export const selectIsAuthenticated = (s: AppState) => !!s.currentUser;

export const selectSetCurrentUser = (s: AppState) => s.setCurrentUser;
export const selectUpdateCurrentUser = (s: AppState) => s.updateCurrentUser;
export const selectClearCurrentUser = (s: AppState) => s.clearCurrentUser;
