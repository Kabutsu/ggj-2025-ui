import { useEffect } from 'react';
import { User } from '../../../../api/posts';
import { useFlagUser, useUser } from '../../../../api/users';
import { useSocket } from '../../../../lib/socket';
import { useRoomStore } from '../../../feed/store';
import { CommentsIcon, FlagIconFilled, ThumbDownIcon, ThumbUpIcon, WritePostIcon } from '../../../icons';
import LoadingSpinner from '../../../loader';
import StaticCard from '../../../static-card';

import { useUserInfoStore } from '../store';
import { useRooms } from '../../../../api/rooms';

const UserProfileView = ({ id, profileUrl, name }: User) => {
  const socket = useSocket();
  const { userId: currentUserId } = useRoomStore();
  const { userId, toggle } = useUserInfoStore();

  const { roomStatus } = useRooms();
  const { data, isLoading, refetch } = useUser(id);
  const { mutate, isPending } = useFlagUser({ userId: id, flaggedById: currentUserId });

  const isBlocked = roomStatus.data?.blockedUsers.some((user) => user.id === id) ?? false;

  useEffect(() => {
    socket.on('flagged', refetch);

    return () => {
      socket.off('flagged');
    };
  }, [socket, refetch]);

  return (
    <StaticCard
      isVisible={userId === id}
      toggleIsVisible={() => toggle(id)}
    >
      {isLoading ? (
        <LoadingSpinner />
      ): (
        <div className="flex flex-col items-center justify-start gap-6 h-full w-full p-4 bg-off-white">
          <div className="flex items-center justify-between gap-2 w-full">
            <button onClick={() => toggle(id)} className="text-2xl font-bold">X</button>
            <div className="flex items-center justify-center gap-2">
              {data?.flaggedBy?.map((_, i) => (
                <FlagIconFilled key={i} className="w-8 h-8 fill-red-800 opacity-90 rotate-12" />
              ))}
            </div>
            <button
              className="rounded-lg bg-red-800 text-off-white font-bold p-2 disabled:opacity-50"
              onClick={() => mutate()}
              disabled={
                isPending
                || isBlocked
                || data?.flaggedBy?.some((flag) => flag.userId === currentUserId)
              }
            >
              Flag
            </button>
          </div>
          <div className="flex items-center justify-start gap-2 w-full">
            <img
              src={profileUrl}
              alt={`${name}'s profile picture`}
              className={`w-15 h-15 rounded-full ${isBlocked ? 'opacity-20' : ''}`}
            />
            <h1 className={`text-4xl font-bold pr-2 ${isBlocked ? 'line-through opacity-20' : ''}`}>{name}</h1>
          </div>
          <div className="flex items-center justify-start gap-2 p-2 w-full border-b-2 border-off-gray">
            <WritePostIcon className="w-10 h-10" />
            <p className="text-xl"><span className="font-bold">Posts:</span> {data?.posts?.length}</p>
          </div>
          <div className="flex items-center justify-start gap-2 p-2 w-full border-b-2 border-off-gray">
            <CommentsIcon className="w-10 h-10" />
            <p className="text-xl"><span className="font-bold">Comments:</span> {data?.comments?.length}</p>
          </div>
          <div className="flex flex-col items-start justify-start gap-2 w-full p-2 border-b-2 border-off-gray">
            <div className="flex items-center justify-start gap-2 w-full">
              <ThumbUpIcon className="w-10 h-10" />
              <p className="text-xl"><span className="font-bold">Likes:</span> {data?.likes?.length}</p>
            </div>
            {data?.likes?.map((like) => (
              <p key={like.id} className="text-lg text-left pl-5 text-pretty">
                <span className="font-bold">{like.Post.User.name}:</span> {like.Post.content}
              </p>
            ))}
          </div>
          <div className="flex flex-col items-start justify-start gap-2 w-full p-2 border-b-2 border-off-gray">
            <div className="flex items-center justify-start gap-2 w-full">
              <ThumbDownIcon className="w-10 h-10" />
              <p className="text-xl"><span className="font-bold">Dislikes:</span> {data?.dislikes?.length}</p>
            </div>
            {data?.dislikes?.map((dislike) => (
              <p key={dislike.id} className="text-lg text-left pl-5 text-pretty">
                <span className="font-bold">{dislike.Post.User.name}:</span> {dislike.Post.content}
              </p>
            ))}
          </div>
        </div>
      )}
    </StaticCard>
  );
};

export default UserProfileView;
