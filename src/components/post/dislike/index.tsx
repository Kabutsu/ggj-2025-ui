import { useState } from 'react';

import { ThumbDownIcon, ThumbDownIconFilled } from '../../icons';
import { usePostStore } from '../store';
import { useSocket } from '../../../lib/socket';
import { useReactions } from '../../../api/posts';
import { useRoomStore } from '../../feed/store';

const Dislike = () => {
  const socket = useSocket();

  const { dislike: { mutateAsync } } = useReactions();

  const { data: { dislikes, id: postId } } = usePostStore();
  const { userId } = useRoomStore();

  const [disliked, setDisliked] = useState(dislikes.some((dislike) => dislike.userId === userId));
  const Icon = disliked ? ThumbDownIconFilled : ThumbDownIcon;

  const onDislike = () => {
    if (disliked) {
      mutateAsync({ postId, userId, undo: true }).then((res) => {
        socket.emit('undislike', res);
      });
    } else {
      mutateAsync({ postId, userId, undo: false }).then((res) => {
        socket.emit('dislike', res);
      });
    }

    setDisliked((prev) => !prev);
  }

  return (
    <button
      onClick={onDislike}
      className="flex items-center gap-1"
    >
      <Icon className="w-6 h-6" />
      <span>{dislikes.length}</span>
    </button>
  );
};

export default Dislike;
