import { create } from "zustand";

type User = {
  id: number;
  username: string;
}
interface AuthActions {
  setUser: (user: User) => void;
  setAccessToken: (accessToken: string) => void;
  setAuth: (user: User, accessToken: string) => void;
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
    setAuth: (user, accessToken) => set({ user, accessToken }),

    login: (user, accessToken) => {
      set({ user, accessToken });
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("user", JSON.stringify(user));
    },
    logout: () => {
      set({ user: null, accessToken: null });
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
    }
  }
}));

const useUser        = () => useAuthStore(state => state.user);
const useAuthActions = () => useAuthStore(state => state.actions);
const useAccessToken = () => useAuthStore(state => state.accessToken);

export { useUser, useAccessToken, useAuthActions, type User, type AuthActions, type AuthState };
