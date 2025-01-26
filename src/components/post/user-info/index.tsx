import { useEffect, useMemo, useState } from 'react';

import { useSocket } from '../../../lib/socket';

import type { User } from '../../../api/posts';

import { useUserInfoStore } from './store';
import UserProfileView from './detailed-view';

const UserInfo = ({ name, sentiment, profileUrl, id, isBlocked, ...rest }: User & { isBlocked: boolean }) => {
  const socket = useSocket();

  const [userSentiment, setUserSentiment] = useState(sentiment);

  const borderColor = useMemo(() => {
    if (userSentiment <= 33) {
      // Red to Orange
      const red = 255;
      const green = Math.floor((userSentiment / 33) * 165); // 0 to 165
      return `rgb(${red}, ${green}, 0)`; // Red to Orange
    } else if (userSentiment <= 66) {
      // Orange to Yellow
      const red = 255;
      const green = Math.floor(((userSentiment - 33) / 33) * 255); // 0 to 255
      return `rgb(${red}, ${green}, 0)`; // Orange to Yellow
    } else {
      // Yellow to Green
      const green = 255;
      const red = Math.floor(((100 - userSentiment) / 34) * 255); // 255 to 0
      return `rgb(${red}, ${green}, 0)`; // Yellow to Green
    }
  }, [userSentiment]);

  useEffect(() => {
    socket.on('sentiment', (data: { userId: string; sentiment: number }) => {
      if (data.userId === id) {
        setUserSentiment(data.sentiment);
      }
    });

    return () => {
      socket.off('sentiment');
    };
  }, [socket, id]);

  const { toggle } = useUserInfoStore();

  return (
    <>
      <div className="flex items-center justify-start gap-2 mr-auto cursor-pointer" onClick={() => toggle(id)}>
        <img
          src={profileUrl}
          alt={`${name}'s profile picture`}
          className="w-10 h-10 rounded-full transition-colors duration-300 ease-in-out"
          style={{
            border: `4px solid ${borderColor}`,
            opacity: isBlocked ? 0.2 : 1,
          }}
        />
        <h1 className={`text-2xl font-bold ${isBlocked ? 'line-through opacity-20' : ''}`}>
          {name}
        </h1>
      </div>
      <UserProfileView {...{ name, sentiment, profileUrl, id, isBlocked, ...rest }} />
    </>
  );
};

export default UserInfo;
