import { useState } from 'react';

import { ThumbDownIcon, ThumbDownIconFilled } from '../../icons';

type Props = {
  dislikes: number | null;
};

const Dislike = ({ dislikes }: Props) => {
  const [disliked, setDisliked] = useState(false);
  const Icon = disliked ? ThumbDownIconFilled : ThumbDownIcon;

  return (
    <button
      onClick={() => setDisliked((prev) => !prev)}
      className="flex items-center gap-1"
    >
      <Icon className="w-6 h-6" />
      <span>{disliked ? (dislikes ?? 0) + 1 : dislikes}</span>
    </button>
  );
};

export default Dislike;
