import { useRef } from 'react';

import { useRooms } from '../../api/rooms';
import Feed from '../feed';
import { useRoomStore } from '../feed/store';

const ROOM_CODE = 'asdf12';

export default function GameRoom() {
  const usernameRef = useRef<HTMLInputElement>(null);

  const { roomCode } = useRoomStore();

  const {
    joinRoomMutation: { mutate: handleJoinRoom },
  } = useRooms();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleJoinRoom({
      code: ROOM_CODE,
      name: usernameRef.current!.value,
      profileUrl: 'https://example.com',
    });
  };

  if (roomCode?.length) return <Feed />;

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center justify-start gap-5 w-full h-full p-10 pt-25"
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
