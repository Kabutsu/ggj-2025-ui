import { create } from "zustand";

type UserInfoState = {
  userId: string | null;
  toggle: (userId: string) => void;
};

export const useUserInfoStore = create<UserInfoState>((set) => ({
  userId: null,
  toggle: (userId) => set((state) => ({ userId: state.userId === userId ? null : userId })),
}));