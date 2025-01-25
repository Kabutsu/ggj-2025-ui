import { useState } from 'react';

import { ThumbUpIcon, ThumbUpIconFilled } from '../../icons';
import { usePostStore } from '../store';
import { useSocket } from '../../../lib/socket';
import { useReactions } from '../../../api/posts';
import { useRoomStore } from '../../feed/store';

const Like = () => {
  const socket = useSocket();

  const { like: { mutateAsync } } = useReactions();

  const { data: { likes, id: postId } } = usePostStore();
  const { userId } = useRoomStore();

  const [liked, setLiked] = useState(likes.some((like) => like.userId === userId));
  const Icon = liked ? ThumbUpIconFilled : ThumbUpIcon;

  const onLike = () => {
    if (liked) {
      mutateAsync({ postId, userId, undo: true })
        .then((res) => {
          socket.emit('unlike', res);
        })
        .catch((err) => {
          console.log('Error undoing like', err);
        });
    } else {
      mutateAsync({ postId, userId, undo: false })
        .then((res) => {
          socket.emit('like', res);
        })
        .catch((err) => {
          console.log('Error liking', err);
        });
    }

    setLiked((prev) => !prev);
  }

  return (
    <button
      onClick={onLike}
      className="flex items-center gap-1"
    >
      <Icon className="w-6 h-6" />
      <span>{likes.length}</span>
    </button>
  );
};

export default Like;
