import { useState } from 'react';

import { useRooms } from '../../api/rooms';
import Feed from '../feed';
import { useRoomStore } from '../feed/store';

const ROOM_CODE = 'asdf12';

export default function GameRoom() {
  const [username, setUsername] = useState('');
  const [profileUrl, setProfileUrl] = useState('');

  const { roomCode } = useRoomStore();

  const {
    joinRoomMutation: { mutate: handleJoinRoom },
  } = useRooms();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleJoinRoom({
      code: ROOM_CODE,
      name: username,
      profileUrl,
    });
  };

  if (roomCode?.length) return <Feed />;

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center justify-start gap-5 w-full h-full p-10 pt-25 md:w-[40rem] md:mx-auto"
    >
      <h1 className=" text-3xl text-off-black font-bold text-center mb-5">
        Welcome to<br /><span className="text-blue-400">The Social Bubble</span>
      </h1>
      <p className="text-gray-600 text-center">
        Welcome to <span className="font-bold text-blue-400">The Social Bubble</span>, where every action has a social consequence. Gain likes and comments to increas your social standing, and downvote posts you dislike to block other users from the game. 
      </p>
      <p className="text-gray-600 text-center mb-5">
        But watch out - there are Trolls among us, and they're out to sow chaos and discord. Can you identify them before it's too late?
      </p>
      <p className="text-gray-600 text-center mb-5">
        Whether you’re defending or deceiving, every interaction shapes the future of the Bubble. Will you uphold order, or watch it crumble?
      </p>
      <input
        className="w-full md:w-80 border-2 border-blue-400 py-2 px-5 rounded-full bg-off-gray text-gray-800"
        type="text"
        placeholder="What is your name?"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <div className="flex items-center justify-center gap-5">
        {Array.from({ length: 2 }).map((_, i) => (
          <button
            key={i}
            className={`w-18 h-18 rounded-full border-5  ${profileUrl === `images/profile_${i + 1}.png` ? 'border-blue-400' : 'border-transparent opacity-80'}`}
            type="button"
            onClick={() => setProfileUrl(`images/profile_${i + 1}.png`)}
          >
            <img src={`images/profile_${i + 1}.png`} alt={`Profile ${i + 1}`} />
          </button>
        ))}
      </div>
      <button
        className="bg-blue-400 text-white py-2 px-5 rounded-full font-semibold drop-shadow-md disabled:cursor-default disabled:bg-blue-200"
        type="submit"
        disabled={!username.length || !profileUrl.length}
      >
        Join Us
      </button>
    </form>
  );
}
