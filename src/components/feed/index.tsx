import Post from '../post';
import { usePosts } from '../../api/posts';

import PostButton from './post-button';
import WritePost from './write-post';
import { useRoomStore } from './store';
import LoadingSpinner from '../loader';

const Feed = () => {
  const { roomCode } = useRoomStore();
  const { data: posts, isLoading, isError } = usePosts(roomCode);

  console.log('pre: roomCode', roomCode);

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <div>Error fetching posts</div>;

  console.log('posts', posts);

  return (
    <div className="flex flex-col">
      {posts?.map((post) => (
        <Post key={post.id} {...post} />
      ))}
      <PostButton />
      <WritePost />
    </div>
  );
};

export default Feed;