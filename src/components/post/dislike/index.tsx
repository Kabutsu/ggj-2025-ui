import { useState } from 'react';

import { ThumbDownIcon, ThumbDownIconFilled } from '../../icons';
import { usePostStore } from '../store';

const Dislike = () => {
  const { data: { dislikes }, addDislike, removeDislike } = usePostStore();
  const [disliked, setDisliked] = useState(false);
  const Icon = disliked ? ThumbDownIconFilled : ThumbDownIcon;

  return (
    <button
      onClick={() => {
        if (disliked) {
          removeDislike();
        } else {
          addDislike();
        }

        setDisliked((prev) => !prev);
      }}
      className="flex items-center gap-1"
    >
      <Icon className="w-6 h-6" />
      <span>{dislikes}</span>
    </button>
  );
};

export default Dislike;
