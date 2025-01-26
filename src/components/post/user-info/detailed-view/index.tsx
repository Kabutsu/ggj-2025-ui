import { User } from '../../../../api/posts';
import { useUser } from '../../../../api/users';
import { CommentsIcon, ThumbDownIcon, ThumbUpIcon, WritePostIcon } from '../../../icons';
import LoadingSpinner from '../../../loader';
import StaticCard from '../../../static-card';

import { useUserInfoStore } from '../store';

const UserProfileView = ({ id, profileUrl, name }: User) => {
  const { userId, toggle } = useUserInfoStore();

  const { data, isLoading } = useUser(id);

  //if (id === userId && data != null) console.log(data);

  return (
    <StaticCard
      isVisible={userId === id}
      toggleIsVisible={() => toggle(id)}
    >
      {isLoading ? (
        <LoadingSpinner />
      ): (
        <div className="flex flex-col items-center justify-start gap-6 h-full w-full p-4 bg-off-white">
          <div className="flex items-center justify-start gap-2 w-full">
            <button onClick={() => toggle(id)} className="text-2xl font-bold">X</button>
          </div>
          <div className="flex items-center justify-start gap-2 w-full">
            <img
              src={profileUrl}
              alt={`${name}'s profile picture`}
              className="w-15 h-15 rounded-full"
            />
            <h1 className="text-4xl font-bold">{name}</h1>
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
