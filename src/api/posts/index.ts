import axios from 'axios';
import { useQuery, useMutation } from '@tanstack/react-query';

export type User = {
  id: string;
  name: string;
  profileUrl: string;
  sentiment: number;
  roomId: string;
  isTraitor: boolean;
};

export type Comment = {
  id: string;
  content: string;
  createdAt: string;
  userId: string;
  postId: string;
};

export type Like = {
  id: string;
  userId: string;
  postId: string;
};

export type Dislike = {
  id: string;
  userId: string;
  postId: string;
}

export type Post = {
  id: string;
  content: string;
  createdAt: string;
  userId: string;
  roomId: string;
  
  User: User;
  likes: Array<Like>;
  dislikes: Array<Dislike>;
  comments: Array<Comment>;
};

const baseURL = `${import.meta.env.VITE_BASE_API_URL}/posts`;

const fetchPosts = async (roomId: string) => {
  const { data } = await axios.get<Post[]>(`/${roomId}`, { baseURL });
  return data;
};

export const usePosts = (roomId: string) => {
  return useQuery({
    queryKey: ['posts', roomId],
    queryFn: () => fetchPosts(roomId),
  });
};

const createPost = async ({ userId, roomId, content }: { userId: string, roomId: string, content: string }) => {
  await axios.post('/', { userId, roomId, content }, { baseURL });
};

export const usePost = ({ roomId, userId, onSettled }: { roomId: string, userId: string, onSettled: () => void }) => {
  return useMutation({
    onMutate: async (content: string) => {
      await createPost({ userId, roomId, content });
    },
    onSettled,
  });
};

const postComment = async (comment: Pick<Comment, 'content' | 'postId' | 'userId'>) => {
  await axios.post(`/${comment.postId}/comments`, comment, {
    baseURL,
  });
};

export const useComment = () => {
  return useMutation({
    onMutate: async (comment: Pick<Comment, 'content' | 'postId' | 'userId'>) => {
      await postComment(comment);
    },
  });
};

const react = async (postId: string, type: 'like' | 'dislike', undo: boolean) => await axios.post(`/${postId}/${undo ? 'un' : ''}${type}`, null, {
  baseURL,
});

export const useReactions = () => {
  const like = useMutation({
    onMutate: async ({ postId, undo }: { postId: string, undo: boolean }) => {
      const data = await react(postId, 'like', undo);
      if (data.status !== 200) throw new Error('Failed to react');
      return data.data as Like;
    },
  });

  const dislike = useMutation({
    onMutate: async ({ postId, undo }: { postId: string, undo: boolean }) => {
      const data = await react(postId, 'dislike', undo);
      if (data.status !== 200) throw new Error('Failed to react');
      return data.data as Dislike;
    },
  });

  return { like, dislike };
};
