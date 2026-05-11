import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { User } from "@/types";

interface UserStore {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  updateCredits: (credits: number) => void;
  clear: () => void;
}

export const useUserStore = create<UserStore>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isLoading: false,

        setUser: (user) => set({ user }),

        setLoading: (isLoading) => set({ isLoading }),

        updateCredits: (credits) =>
          set((state) =>
            state.user
              ? { user: { ...state.user, credits_remaining: credits } }
              : {}
          ),

        clear: () => set({ user: null }),
      }),
      {
        name: "prismflow-user",
        partialize: (state) => ({ user: state.user }),
      }
    ),
    { name: "UserStore" }
  )
);
