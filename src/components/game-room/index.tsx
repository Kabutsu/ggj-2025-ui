import { useRef, useState } from 'react';

import { useRooms } from '../../api/rooms';
import Feed from '../feed';

export default function GameRoom() {
  const [roomCode, setRoomCode] = useState('asdf12');
  const usernameRef = useRef<HTMLInputElement>(null);

  const setUsername = (username: string) => {
    usernameRef.current!.value = username;
  };

  const {
    inRoom,
    joinRoomMutation: { mutate: handleJoinRoom },
  } = useRooms({
    setRoomCode,
    setUsername,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleJoinRoom({
      code: roomCode,
      name: usernameRef.current!.value,
      profileUrl: 'https://example.com',
    });
  };

  if (inRoom) return <Feed />;

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center justify-start gap-5 w-full h-full p-10 pt-25 opacity-0 transition-opacity duration-300 delay-150 animate-fadeIn"
    >
      <h1 className="text-off-black font-bold text-center mb-5">
        Welcome to<br /><span className="text-blue-400">The Social Bubble</span>
      </h1>
      {/* <button onClick={() => handleCreateRoom()}>Create Room</button> */}
      {/* <input
        type="text"
        placeholder="Room Code"
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value)}
      /> */}
      <input
        ref={usernameRef}
        className="w-full border-2 border-blue-400 py-2 px-5 rounded-full bg-off-gray text-gray-800"
        type="text"
        placeholder="What is your name?"
      />
      <button
        className="bg-blue-400 text-white py-2 px-5 rounded-full font-semibold drop-shadow-md"
        type="submit"
      >
        Join Us
      </button>
    </form>
  );
}
