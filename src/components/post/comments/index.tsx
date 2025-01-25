import { CommentsIcon } from '../../icons';
import { usePostStore } from '../store';

const Comments = () => {
  const { data: { comments }, toggleCommentsView } = usePostStore();
  return (
    <button onClick={toggleCommentsView} className="flex items-center gap-1">
      <CommentsIcon className="w-6 h-6" />
      <span>{comments.length}</span>
    </button>
  );
};

export default Comments;