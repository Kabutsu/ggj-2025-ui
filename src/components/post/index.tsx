import viteLogo from '/vite.svg';

import Like from './like';
import Dislike from './dislike';
import Comments from './comments';
import Comment from './comment';
import { PostStore } from './store';

export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
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

const Post = ({ user, body, ...rest }: Post) => {
  return (
    <PostStore.Provider initialValue={{ user, body, ...rest }}>
      <div className="bg-off-white flex flex-col items-center justify-center gap-1 p-2 border-t-2 border-off-gray">
        <div className="flex items-center justify-start gap-2 w-full">
          <img src={viteLogo} alt="Vite Logo" className="w-10 h-10" />
          <h1 className="text-3xl font-bold">{user.name}</h1>
        </div>
        <p className="text-lg w-full text-left">{body}</p>
        <div className="flex items-center justify-start gap-4 w-full pt-2">
          <Like />
          <Dislike />
          <Comments />
          <Comment />
        </div>
      </div>
    </PostStore.Provider>
  );
};

export default Post;
