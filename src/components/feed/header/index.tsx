import { useRooms } from '../../../api/rooms';

const FeedHeader = () => {
  const { roomStatus } = useRooms();

  return (
    <div className="sticky top-0 z-10 bg-off-white p-5 shadow-md md:rounded-xl md:mb-7.5 md:top-3">
      <h1 className="text-xl font-bold text-left text-blue-400">The Social Bubble</h1>
      <h2 className="text-lg text-left text-gray-600">
        There are <span className="font-extrabold">{roomStatus.data?.traitorCount} </span>Trolls among us.
      </h2>
    </div>
  );
};

export default FeedHeader;
