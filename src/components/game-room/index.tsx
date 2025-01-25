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
      <p className="text-gray-600 text-center">
        Step into the world of <span className="font-bold text-blue-400">The Social Bubble</span>, where Mods strive to keep the peace, but beware—Trolls are lurking to spread chaos! Your mission is simple: work with your fellow Mods to maintain harmony, or, if you're a Troll, stir up disinformation without getting caught. 
      </p>
      <p className="text-gray-600 text-center mb-5">
        Whether you’re defending or deceiving, every interaction shapes the future of the Bubble. Will you uphold order, or watch it crumble?
      </p>

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
