import { useRef } from 'react';

import { CommentIcon } from '../../icons';
import { usePostStore } from '../store';

const Comment = () => {
  const { data: { id, comments }, comment: postComment } = usePostStore();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <form className="w-full relative" onSubmit={(e) => {
      e.preventDefault();
      postComment({
        body: inputRef.current?.value || '',
        postId: id,
        id: comments.sort((a, b) => a.id - b.id)[comments.length - 1]?.id + 1 || 1,
      });
      // Clear and unfocus input
      inputRef.current!.value = '';
      inputRef.current?.blur();
    }}>
      <input
        ref={inputRef}
        type="text"
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