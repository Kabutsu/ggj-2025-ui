import { useStore } from 'zustand';
import { createStore } from 'zustand/vanilla';

import { createZustandContext } from '../../lib/zustand';

import type { Comment, Post } from '.';

type State = {
  data: Post;
  addLike: () => void;
  addDislike: () => void;
  removeLike: () => void;
  removeDislike: () => void;
  comment: (comment: Comment) => void;
  viewingComments: boolean;
  toggleCommentsView: () => void;
};

export const PostStore = createZustandContext((initialValue: Post) => {
  return createStore<State>((set) => ({
    data: initialValue,
    addLike: () => set((state) => ({ data: { ...state.data, likes: state.data.likes + 1 } })),
    addDislike: () => set((state) => ({ data: { ...state.data, dislikes: state.data.dislikes + 1 } })),
    removeLike: () => set((state) => ({ data: { ...state.data, likes: state.data.likes - 1 } })),
    removeDislike: () => set((state) => ({ data: { ...state.data, dislikes: state.data.dislikes - 1 } })),
    comment: (comment) => set((state) => ({ data: { ...state.data, comments: [...state.data.comments, comment] } })),
    viewingComments: false,
    toggleCommentsView: () => set((state) => ({ viewingComments: !state.viewingComments })),
  }));
});

export const usePostStore = () => {
  const store = PostStore.useContext();
  if (!store) throw new Error('usePostStore must be used within a PostStoreProvider');
  return useStore(store);
};
