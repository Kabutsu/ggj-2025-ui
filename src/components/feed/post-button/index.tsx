import { WritePostIcon } from '../../icons';
import { useWritePostStore } from '../store'

const PostButton = () => {
  const { isOpen, toggle } = useWritePostStore();

  if (isOpen) return null;

  return (
    <button onClick={toggle} className="fixed bottom-6 right-2 p-4 bg-blue-500 text-white rounded-full">
      <WritePostIcon className="w-7 h-7 fill-off-white" />
    </button>
  );
};

export default PostButton;
