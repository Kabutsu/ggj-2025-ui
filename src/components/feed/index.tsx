import { useEffect } from 'react';

import LoadingSpinner from '../loader';
import Post from '../post';

import { usePosts } from '../../api/posts';
import { useSocket } from '../../lib/socket';

import PostButton from './post-button';
import WritePost from './write-post';
import { useRoomStore } from './store';

const Feed = () => {
  const socket = useSocket();
  const { roomCode } = useRoomStore();
  const { data: posts, isLoading, isError, refetch } = usePosts(roomCode);

  useEffect(() => {
    socket.on('posted', refetch);

    return () => {
      socket.off('posted', refetch);
    };
  }, [socket, refetch]);

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