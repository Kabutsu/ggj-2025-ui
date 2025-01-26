import { useRef } from 'react';

import { CommentIcon } from '../../icons';
import { usePostStore } from '../store';
import { useSocket } from '../../../lib/socket';
import { useComment } from '../../../api/posts';
import { useRoomStore } from '../../feed/store';

type Props = {
  disabled: boolean;
};

const Comment = ({ disabled }: Props) => {
  const socket = useSocket();
  const { mutate } = useComment();
  const { data: { id } } = usePostStore();
  const { userId } = useRoomStore();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <form className="w-full relative" onSubmit={(e) => {
      e.preventDefault();
      const comment = {
        content: inputRef.current?.value || '',
        postId: id,
        userId,
      };

      socket.emit('comment', comment);
      mutate(comment);

      // Clear and unfocus input
      inputRef.current!.value = '';
      inputRef.current?.blur();
    }}>
      <input
        ref={inputRef}
        type="text"
        placeholder={disabled ? 'This user is blocked.' : 'Leave a comment...'}
        className="w-full py-2 pl-2.5 pr-10 bg-off-gray text-gray-800 rounded-full relative"
        disabled={disabled}
      />
      <button
        className="absolute right-2 top-2"
        type="submit"
        disabled={disabled}>
        <CommentIcon className={`w-6 h-6 ${disabled ? 'fill-gray-400' : ''}`} />
      </button>
    </form>
  )
};

export default Comment;