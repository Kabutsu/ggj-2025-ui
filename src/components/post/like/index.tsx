import { useState } from 'react';

import { ThumbUpIcon, ThumbUpIconFilled } from '../../icons';
import { usePostStore } from '../store';
import { useSocket } from '../../../lib/socket';
import { useReactions } from '../../../api/posts';

const Like = () => {
  const socket = useSocket();
  const { like: { mutate } } = useReactions();
  const { data: { likes, id: postId } } = usePostStore();
  const [liked, setLiked] = useState(false);
  const Icon = liked ? ThumbUpIconFilled : ThumbUpIcon;

  const onLike = () => {
    if (liked) {
      socket.emit('unlike', { postId });
      mutate({ postId, undo: true });
    } else {
      socket.emit('like', { postId });
      mutate({ postId, undo: false });
    }

    setLiked((prev) => !prev);
  }

  return (
    <button
      onClick={onLike}
      className="flex items-center gap-1"
    >
      <Icon className="w-6 h-6" />
      <span>{likes}</span>
    </button>
  );
};

export default Like;
