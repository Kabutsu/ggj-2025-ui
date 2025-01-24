import { CommentsIcon } from '../../icons';

type Props = {
  comments: number | null;
};

const Comments = ({ comments }: Props) => {
  return (
    <div className="flex items-center gap-1">
      <CommentsIcon className="w-6 h-6" />
      <span>{comments}</span>
    </div>
  );
};

export default Comments;