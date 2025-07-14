import { create } from "zustand";

interface User {
  id: number;
  username: string;
}
interface AuthActions {
  setUser: (user: User | null) => void;
  setAccessToken: (accessToken: string | null) => void;
  login: (user: User, accessToken: string) => void;
  logout: () => void;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  actions: AuthActions;
}

const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  accessToken: null,
  actions: {
    setUser: (user) => set({ user }),
    setAccessToken: (accessToken) => set({ accessToken }),
    login: (user, accessToken) => set({ user, accessToken }),
    logout: () => set({ user: null, accessToken: null }),
  },
}));

const useUser        = () => useAuthStore(state => state.user);
const useAuthActions = () => useAuthStore(state => state.actions);
const useAccessToken = () => useAuthStore(state => state.accessToken);

export { useUser, useAccessToken, useAuthActions, type User, type AuthActions, type AuthState };
