export type CurrentUser = {
  id: string | number;
  email: string;
  name?: string;
  avatarUrl?: string;
  roles?: string[];
} | null;

export interface UserSlice {
  currentUser: CurrentUser;
  setCurrentUser: (u: NonNullable<CurrentUser>) => void;
  updateCurrentUser: (patch: Partial<NonNullable<CurrentUser>>) => void;
  clearCurrentUser: () => void;
}

export type AppState = UserSlice;
