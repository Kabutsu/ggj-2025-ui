import viteLogo from '/vite.svg';

import Like from './like';
import Dislike from './dislike';
import Comments from './comments';
import Comment from './comment';

const Post = () => {
  return (
    <div className="bg-off-white flex flex-col items-center justify-center gap-1 p-2 border-t-2 border-off-gray">
      <div className="flex items-center justify-start gap-2 w-full">
        <img src={viteLogo} alt="Vite Logo" className="w-10 h-10" />
        <h1 className="text-3xl font-bold">Hello from Post</h1>
      </div>
      <p className="text-lg w-full text-left">This is a post component</p>
      <div className="flex items-center justify-start gap-4 w-full pt-2">
        <Like likes={10} />
        <Dislike dislikes={5} />
        <Comments comments={20} />
        <Comment />
      </div>
    </div>
  );
};

export default Post;
