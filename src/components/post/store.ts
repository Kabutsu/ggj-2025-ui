import { useStore } from 'zustand';
import { createStore } from 'zustand/vanilla';

import { createZustandContext } from '../../lib/zustand';

import type { Comment, Dislike, Like, Post } from '../../api/posts';

type State = {
  data: Post;
  addLike: (like: Like) => void;
  addDislike: (dislike: Dislike) => void;
  removeLike: (like: Like) => void;
  removeDislike: (dislike: Dislike) => void;
  comment: (comment: Comment) => void;
  viewingComments: boolean;
  toggleCommentsView: () => void;
};

export const PostStore = createZustandContext((initialValue: Post) => {
  return createStore<State>((set) => ({
    data: initialValue,
    addLike: (like) => set((state) => ({ data: { ...state.data, likes: [...state.data.likes, like] } })),
    addDislike: (dislike) => set((state) => ({ data: { ...state.data, dislikes: [...state.data.dislikes, dislike] } })),
    removeLike: (like) => set((state) => ({ data: { ...state.data, likes: state.data.likes.filter((l) => l.id !== like.id) } })),
    removeDislike: (dislike) => set((state) => ({ data: { ...state.data, dislikes: state.data.dislikes.filter((d) => d.id !== dislike.id) } })),
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
