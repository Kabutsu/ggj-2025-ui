import { create } from "zustand";

type WritePostState = {
  isOpen: boolean;
  toggle: () => void;
};

export const useWritePostStore = create<WritePostState>((set) => ({
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));

type RoomState = {
  roomCode: string;
  setRoomCode: (roomCode: string) => void;
  userId: string;
  setUserId: (username: string) => void;
};

export const useRoomStore = create<RoomState>((set) => ({
  roomCode: '',
  setRoomCode: (roomCode) => set({ roomCode }),
  userId: '',
  setUserId: (userId) => set({ userId }),
}));
