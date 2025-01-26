import { useEffect } from 'react';

import { PostStore, usePostStore } from './store';

import { useSocket } from '../../lib/socket';
import type { Comment, Dislike, Like, Post } from '../../api/posts';

import LikeButton from './like';
import DislikeButton from './dislike';
import Comments from './comments';
import CommentInput from './comment';
import CommentsList from './comments-list';
import UserInfo from './user-info';
import { useRooms } from '../../api/rooms';

const Post = ({ User, content }: Post) => {
  const socket = useSocket();
  const {
    data: { id },
    addLike,
    addDislike,
    removeLike,
    removeDislike,
    comment,
  } = usePostStore();

  const { roomStatus } = useRooms();
  
  const isBlocked = roomStatus.data?.blockedUsers.some((user) => user.id === User.id)
    ?? false;

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
      <div className="bg-off-white flex flex-col items-center justify-center gap-1 p-2 border-t-2 border-off-gray md:border-none md:mb-5 md:rounded-2xl md:p-4">
        <UserInfo {...User} isBlocked={isBlocked} />
        <p className="text-lg w-full text-left">{content}</p>
        <div className="flex items-center justify-start gap-4 w-full pt-2">
          <LikeButton disabled={isBlocked} />
          <DislikeButton disabled={isBlocked} />
          <Comments />
          <CommentInput disabled={isBlocked} />
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
