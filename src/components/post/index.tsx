import { useEffect } from 'react';

import viteLogo from '/vite.svg';

import { PostStore, usePostStore } from './store';

import { useSocket } from '../../lib/socket';

import Like from './like';
import Dislike from './dislike';
import Comments from './comments';
import Comment from './comment';
import CommentsList from './comments-list';

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

const Post = ({ user: { name, sentiment }, body }: Post) => {
  const socket = useSocket();
  const { addLike, addDislike, comment } = usePostStore();

  const getBorderColor = (sentiment: number) => {
    if (sentiment <= 33) {
      // Red to Orange
      const red = 255;
      const green = Math.floor((sentiment / 33) * 165); // 0 to 165
      return `rgb(${red}, ${green}, 0)`; // Red to Orange
    } else if (sentiment <= 66) {
      // Orange to Yellow
      const red = 255;
      const green = Math.floor(((sentiment - 33) / 33) * 255); // 0 to 255
      return `rgb(${red}, ${green}, 0)`; // Orange to Yellow
    } else {
      // Yellow to Green
      const green = 255;
      const red = Math.floor(((100 - sentiment) / 34) * 255); // 255 to 0
      return `rgb(${red}, ${green}, 0)`; // Yellow to Green
    }
  };

  useEffect(() => {
    socket.on('comment', (data: Comment) => {
      console.log('New comment:', data);
      comment(data);
    });
  
    socket.on('addLike', () => {
      console.log('Like added');
      addLike();
    });
  
    socket.on('addDislike', () => {
      console.log('Dislike added');
      addDislike();
    });
  
    return () => {
      socket.off('connect');
      socket.off('comment');
      socket.off('addLike');
      socket.off('addDislike');
    };
  }, [comment, addLike, addDislike, socket]);

  return (
    <>
      <div className="bg-off-white flex flex-col items-center justify-center gap-1 p-2 border-t-2 border-off-gray">
        <div className="flex items-center justify-start gap-2 w-full">
          <img
            src={viteLogo}
            alt="Vite Logo"
            className="w-10 h-10 rounded-full"
            style={{
              border: `4px solid ${getBorderColor(sentiment)}`, // Dynamic border color
            }}
          />
          <h1 className="text-3xl font-bold">{name}</h1>
        </div>
        <p className="text-lg w-full text-left">{body}</p>
        <div className="flex items-center justify-start gap-4 w-full pt-2">
          <Like />
          <Dislike />
          <Comments />
          <Comment />
        </div>
      </div>
      <CommentsList />
    </>
  );
};

const PostWrapper = (props: Post) => (
  <PostStore.Provider initialValue={props}>
    <Post {...props} />
  </PostStore.Provider>
);

export default PostWrapper;
