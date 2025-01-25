import { usePost } from '../../../api/posts';
import StaticCard from '../../static-card';
import { useRoomStore, useWritePostStore } from '../store'

const WritePost = () => {
  const { isOpen, toggle } = useWritePostStore();
  const { roomCode, userId } = useRoomStore();
  
  const { mutate } = usePost({
    roomId: roomCode,
    userId,
    onSettled: toggle,
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const content = e.currentTarget.querySelector('textarea')?.value || '';
    mutate(content);
  };

  return (
    <StaticCard isVisible={isOpen} toggleIsVisible={toggle} dismissThreshold={15}>
      <form onSubmit={onSubmit} className="p-4">
        <textarea
          placeholder="What's on your mind?"
          className="w-full p-2 bg-off-gray text-gray-800 rounded-lg"
        />
        <button className="w-full py-2 mt-2 bg-blue-500 text-white rounded-lg">
          Post
        </button>
      </form>
    </StaticCard>
  );
};

export default WritePost;
