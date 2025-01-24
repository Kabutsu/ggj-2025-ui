import { useState } from 'react';

import { ThumbUpIcon, ThumbUpIconFilled } from '../../icons';

type Props = {
  likes: number | null;
};

const Like = ({ likes }: Props) => {
  const [liked, setLiked] = useState(false);
  const Icon = liked ? ThumbUpIconFilled : ThumbUpIcon;

  return (
    <button
      onClick={() => setLiked((prev) => !prev)}
      className="flex items-center gap-1"
    >
      <Icon className="w-6 h-6" />
      <span>{liked ? (likes ?? 0) + 1 : likes}</span>
    </button>
  );
};

export default Like;
