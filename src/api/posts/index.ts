import axios from 'axios';
import { useQuery, useMutation } from '@tanstack/react-query';

export type User = {
  id: number;
  name: string;
  username: string;
  sentiment: number;
};

export type Comment = {
  id: number;
  postId: number;
  body: string;
};

export type Post = {
  id: number;
  user: User;
  body: string;
  likes: number;
  dislikes: number;
  comments: Array<Comment>;
};

const baseURL = `${import.meta.env.VITE_BASE_API_URL}/posts`;

const fetchPosts = async () => {
  const { data } = await axios.get<Post[]>('/', { baseURL });
  return data;
};

export const usePosts = () => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });
};

const postComment = async (comment: Comment) => {
  await axios.post(`/${comment.postId}/comments`, comment, {
    baseURL,
  });
};

export const useComment = () => {
  return useMutation({
    onMutate: async (comment: Comment) => {
      await postComment(comment);
    },
  });
};

const react = async (postId: number, type: 'like' | 'dislike', undo: boolean) => {
  await axios.post(`/${postId}/${undo ? 'un' : ''}${type}`, null, {
    baseURL,
  });
};

export const useReactions = () => {
  const like = useMutation({
    onMutate: async ({ postId, undo }: { postId: number, undo: boolean }) => {
      await react(postId, 'like', undo);
    },
  });

  const dislike = useMutation({
    onMutate: async ({ postId, undo }: { postId: number, undo: boolean }) => {
      await react(postId, 'dislike', undo);
    },
  });

  return { like, dislike };
};
