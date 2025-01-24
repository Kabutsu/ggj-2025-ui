import { useState } from 'react';

import { CommentIcon } from '../../icons';

const Comment = () => {
  const [comment, setComment] = useState('');

  return (
    <form className="w-full relative">
      <input
        type="text"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Leave a comment..."
        className="w-full py-2 pl-2.5 pr-10 bg-off-gray text-gray-800 rounded-full relative"
      />
      <button type="submit" className="absolute right-2 top-2">
        <CommentIcon className="w-6 h-6" />
      </button>
    </form>
  )
};

export default Comment;