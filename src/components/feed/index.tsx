import Post from '../post';
import { usePosts } from '../../api/posts';

const Feed = () => {
  const { data: posts, isError } = usePosts();

  if (isError) return <div>Error fetching posts</div>;

  return (
    <div className="flex flex-col">
      {posts.map((post) => (
        <Post key={post.id} {...post} />
      ))}
    </div>
  );
};

export default Feed;