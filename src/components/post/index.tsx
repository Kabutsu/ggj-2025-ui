import { useEffect, useMemo, useState } from 'react';

import viteLogo from '/vite.svg';

import { PostStore, usePostStore } from './store';

import { useSocket } from '../../lib/socket';
import type { Comment, Dislike, Like, Post } from '../../api/posts';

import LikeButton from './like';
import DislikeButton from './dislike';
import Comments from './comments';
import CommentInput from './comment';
import CommentsList from './comments-list';

const Post = ({ User: { name, sentiment, profileUrl, id: userId }, content }: Post) => {
  const socket = useSocket();
  const {
    data: { id },
    addLike,
    addDislike,
    removeLike,
    removeDislike,
    comment,
  } = usePostStore();

  const [userSentiment, setUserSentiment] = useState(sentiment);

  const borderColor = useMemo(() => {
    if (userSentiment <= 33) {
      // Red to Orange
      const red = 255;
      const green = Math.floor((userSentiment / 33) * 165); // 0 to 165
      return `rgb(${red}, ${green}, 0)`; // Red to Orange
    } else if (userSentiment <= 66) {
      // Orange to Yellow
      const red = 255;
      const green = Math.floor(((userSentiment - 33) / 33) * 255); // 0 to 255
      return `rgb(${red}, ${green}, 0)`; // Orange to Yellow
    } else {
      // Yellow to Green
      const green = 255;
      const red = Math.floor(((100 - userSentiment) / 34) * 255); // 255 to 0
      return `rgb(${red}, ${green}, 0)`; // Yellow to Green
    }
  }, [userSentiment]);

  useEffect(() => {
    socket.on('comment', (data: Comment) => {
      if (data.postId === id) {
        comment(data);
      }
    });
  
    socket.on('liked', (data: Like) => {
      if (data.postId === id) {
        addLike(data);
      }
    });

    socket.on('unliked', (data: Like) => {
      if (data.postId === id) {
        removeLike(data);
      }
    });
  
    socket.on('disliked', (data: Dislike) => {
      if (data.postId === id) {
        addDislike(data);
      }
    });

    socket.on('undisliked', (data: Dislike) => {
      if (data.postId === id) {
        removeDislike(data);
      }
    });

    socket.on('sentiment', (data: { userId: string; sentiment: number }) => {
      if (data.userId === userId) {
        setUserSentiment(Math.max(0, Math.min(100, data.sentiment)));
      }
    });
  
    return () => {
      socket.off('comment');
      socket.off('liked');
      socket.off('disliked');
      socket.off('unliked');
      socket.off('undisliked');
      socket.off('sentiment');
    };
  }, [comment, addLike, addDislike, removeLike, removeDislike, id, userId, socket]);

  return (
    <>
      <div className="bg-off-white flex flex-col items-center justify-center gap-1 p-2 border-t-2 border-off-gray md:border-none md:mb-5 md:rounded-2xl md:p-4">
        <div className="flex items-center justify-start gap-2 w-full">
          <img
            src={profileUrl || viteLogo}
            alt={`${name}'s profile picture`}
            className="w-10 h-10 rounded-full transition-colors duration-300 ease-in-out"
            style={{
              border: `4px solid ${borderColor}`,
            }}
          />
          <h1 className="text-2xl font-bold">{name}</h1>
        </div>
        <p className="text-lg w-full text-left">{content}</p>
        <div className="flex items-center justify-start gap-4 w-full pt-2">
          <LikeButton />
          <DislikeButton />
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
