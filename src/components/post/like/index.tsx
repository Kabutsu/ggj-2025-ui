import { useState } from 'react';

import { ThumbUpIcon, ThumbUpIconFilled } from '../../icons';
import { usePostStore } from '../store';

const Like = () => {
  const { data: { likes }, addLike, removeLike } = usePostStore();
  const [liked, setLiked] = useState(false);
  const Icon = liked ? ThumbUpIconFilled : ThumbUpIcon;

  return (
    <button
      onClick={() => {
        if (liked) {
          removeLike();
        } else {
          addLike();
        }

        setLiked((prev) => !prev);
      }}
      className="flex items-center gap-1"
    >
      <Icon className="w-6 h-6" />
      <span>{likes}</span>
    </button>
  );
};

export default Like;
