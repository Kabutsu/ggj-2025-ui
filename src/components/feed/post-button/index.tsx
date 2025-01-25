import { useWritePostStore } from '../store'

const PostButton = () => {
  const { isOpen, toggle } = useWritePostStore();

  if (isOpen) return null;

  return (
    <button onClick={toggle} className="fixed bottom-5 right-5 p-3 bg-blue-500 text-white rounded-full">
      +
    </button>
  );
};

export default PostButton;
