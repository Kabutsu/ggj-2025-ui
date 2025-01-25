import { useState } from 'react';

import { ThumbDownIcon, ThumbDownIconFilled } from '../../icons';
import { usePostStore } from '../store';
import { useSocket } from '../../../lib/socket';
import { useReactions } from '../../../api/posts';

const Dislike = () => {
  const socket = useSocket();
  const { dislike: { mutate } } = useReactions();
  const { data: { dislikes, id: postId } } = usePostStore();
  const [disliked, setDisliked] = useState(false);
  const Icon = disliked ? ThumbDownIconFilled : ThumbDownIcon;

  const onDislike = () => {
    if (disliked) {
      socket.emit('undislike', { postId });
      mutate({ postId, undo: true });
    } else {
      socket.emit('dislike', { postId });
      mutate({ postId, undo: false });
    }

    setDisliked((prev) => !prev);
  }

  return (
    <button
      onClick={onDislike}
      className="flex items-center gap-1"
    >
      <Icon className="w-6 h-6" />
      <span>{dislikes}</span>
    </button>
  );
};

export default Dislike;
