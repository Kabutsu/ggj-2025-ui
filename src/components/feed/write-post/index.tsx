import { useState } from 'react';
import { usePost } from '../../../api/posts';
import StaticCard from '../../static-card';
import { useRoomStore, useWritePostStore } from '../store'
import { useSocket } from '../../../lib/socket';

const WritePost = () => {
  const socket = useSocket();
  const { isOpen, toggle } = useWritePostStore();
  const { roomCode, userId } = useRoomStore();

  const [content, setContent] = useState('');
  
  const { mutate, isPending } = usePost({
    roomId: roomCode,
    userId,
    onSettled: () => {
      socket.emit('post', { roomCode, userId, message: content });
      setContent('');
      toggle();
    },
  });

  const onSubmit = () => mutate(content);

  return (
    <StaticCard isVisible={isOpen} toggleIsVisible={toggle} disabled>
      <div className="p-4 h-full">
        <div className="flex items-center justify-between p-2 pb-4">
          <button onClick={toggle} className="text-xl font-bold" disabled={isPending}>X</button>
          <h2 className="text-xl font-bold">Write a post</h2>
          <button onClick={onSubmit} className="px-3 py-1 mt-2 bg-blue-500 text-white rounded-xl" disabled={isPending}>
            Post
          </button>
        </div>
        <textarea
          placeholder="What's on your mind?"
          className="w-full h-30 py-2 px-3 bg-off-gray text-gray-800 rounded-lg"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
    </StaticCard>
  );
};

export default WritePost;
