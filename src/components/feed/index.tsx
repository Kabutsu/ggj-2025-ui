import { useEffect, useState } from 'react';

import LoadingSpinner from '../loader';
import Post from '../post';

import { usePosts } from '../../api/posts';
import { useSocket } from '../../lib/socket';

import PostButton from './post-button';
import WritePost from './write-post';
import { useRoomStore } from './store';
import { useUser } from '../../api/users';

const Feed = () => {
  const socket = useSocket();
  const { roomCode, userId } = useRoomStore();
  const { data: posts, isLoading, isError, refetch } = usePosts(roomCode);

  const { data: userData } = useUser(userId);
  const [sentiment, setSentiment] = useState(userData?.sentiment);

  useEffect(() => {
    socket.on('posted', refetch);
    socket.on('sentiment', (data: { userId: string; sentiment: number }) => {
      if (data.userId === userId) {
        setSentiment(data.sentiment);
      }
    });

    return () => {
      socket.off('posted');
      socket.off('sentiment');
    };
  }, [socket, refetch, userId]);

  if (sentiment != null && sentiment <= 0) return (
    <div className="flex flex-col items-center justify-center gap-12 h-full w-full bg-off-black">
      <h1 className=" text-3xl font-bold text-off-white text-center">You are banned from<br /><span className="font-extrabold text-red-800">The Social Bubble</span></h1>
      <button
        onClick={() => {
          localStorage.removeItem('userId');
          localStorage.removeItem('roomCode');
          window.location.reload();
        }}
        className="px-5 py-2 bg-red-900 text-off-white text-xl font-bold rounded-full drop-shadow-md"
      >
        Try again?
      </button>
    </div>
  );

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <div>Error fetching posts</div>;

  return (
    <div className="flex flex-col md:w-[40rem] md:mx-auto md:pt-10">
      {posts?.map((post) => (
        <Post key={post.id} {...post} />
      ))}
      <PostButton />
      <WritePost />
    </div>
  );
};

export default Feed;