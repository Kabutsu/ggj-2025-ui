import { useEffect } from 'react';

import viteLogo from '/vite.svg';

import { PostStore, usePostStore } from './store';

import { useSocket } from '../../lib/socket';

import Like from './like';
import Dislike from './dislike';
import Comments from './comments';
import CommentInput from './comment';
import CommentsList from './comments-list';
import type { Comment, Post } from '../../api/posts';

const Post = ({ user: { name, sentiment }, body }: Post) => {
  const socket = useSocket();
  const {
    data: { id },
    addLike,
    addDislike,
    removeLike,
    removeDislike,
    comment,
  } = usePostStore();

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
      if (data.postId === id) {
        console.log('Comment added');
        comment(data);
      }
    });
  
    socket.on('liked', ({ postId }: { postId: number }) => {
      if (postId === id) {
        console.log('Like added');
        addLike();
      }
    });

    socket.on('unliked', ({ postId }: { postId: number }) => {
      if (postId === id) {
        console.log('Like removed');
        removeLike();
      }
    });
  
    socket.on('disliked', ({ postId }: { postId: number }) => {
      if (postId === id) {
        console.log('Dislike added');
        addDislike();
      }
    });

    socket.on('undisliked', ({ postId }: { postId: number }) => {
      if (postId === id) {
        console.log('Dislike removed');
        removeDislike();
      }
    });
  
    return () => {
      socket.off('comment');
      socket.off('liked');
      socket.off('disliked');
      socket.off('unliked');
      socket.off('undisliked');
    };
  }, [comment, addLike, addDislike, removeLike, removeDislike, id, socket]);

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
          <CommentInput />
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
