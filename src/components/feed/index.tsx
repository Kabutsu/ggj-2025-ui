import { useEffect, useState } from 'react';

import LoadingSpinner from '../loader';
import Post from '../post';

import { usePosts } from '../../api/posts';
import { useSocket } from '../../lib/socket';

import PostButton from './post-button';
import WritePost from './write-post';
import { useRoomStore } from './store';
import { useUser } from '../../api/users';
import FeedHeader from './header';

const Feed = () => {
  const socket = useSocket();

  const { roomCode, userId } = useRoomStore();

  const { data: posts, isLoading: loadingPosts, isError, refetch } = usePosts(roomCode);
  const { data: userData, isLoading: loadingUserData } = useUser(userId);

  const [sentiment, setSentiment] = useState(userData?.sentiment);
  const [showRules, setShowRules] = useState(true);
  const [fadeClass, setFadeClass] = useState('');

  useEffect(() => {
    socket.on('posted', refetch);
    socket.on('sentiment', (data: { userId: string; sentiment: number }) => {
      if (data.userId === userId) {
        setSentiment(data.sentiment);
      }
    });

    return () => {
      socket.off('posted');
      socket.off('sentiment');
    };
  }, [socket, refetch, userId]);

  useEffect(() => {
    // Set a timer to start fading out after 7 seconds
    const fadeTimeout = setTimeout(() => {
      setFadeClass('opacity-0 transition-opacity duration-1000'); // Fade out over 1 second
    }, 7000);

    // Remove the rules after fading out
    const removeTimeout = setTimeout(() => {
      setShowRules(false);
    }, 8000);

    return () => {
      clearTimeout(fadeTimeout);
      clearTimeout(removeTimeout);
    };
  }, []);

  useEffect(() => {
    setSentiment(userData?.sentiment);
  }, [userData?.sentiment]);

  if ((sentiment != null && sentiment <= 0) || (userData?.flaggedBy?.length && userData.flaggedBy.length >= 3)) return (
    <div className="flex flex-col items-center justify-center gap-12 h-full w-full bg-off-black">
      <h1 className=" text-3xl font-bold text-off-white text-center">You are banned from<br /><span className="font-extrabold text-red-800">The Social Bubble</span></h1>
      <button
        onClick={() => {
          localStorage.removeItem('userId');
          localStorage.removeItem('roomCode');
          window.location.reload();
        }}
        className="px-5 py-2 bg-red-900 text-off-white text-xl font-bold rounded-full drop-shadow-md"
      >
        Try again?
      </button>
    </div>
  );

  if (loadingPosts || loadingUserData) return <LoadingSpinner />;
  if (isError) return <div>Error fetching posts</div>;

  return (
    <div className="flex flex-col md:w-[40rem] md:mx-auto md:pt-5">
      <FeedHeader />
      {posts?.map((post) => (
        <Post key={post.id} {...post} />
      ))}
      <PostButton />
      <WritePost />
      {showRules && (
        <div
          className={`fixed bottom-0 right-0 top-0 left-0 bg-opacity-80 z-100 flex flex-col items-center justify-center p-10 ${fadeClass}
                      ${userData?.isTraitor ? 'bg-off-black text-off-white' : 'bg-off-white text-off-black'}`}
        >
          <h2 className={`text-3xl font-bold mb-5 ${userData?.isTraitor ? 'text-red-800' : 'text-blue-400'}`}>
            {userData?.isTraitor ? 'You are a Troll' : 'You are a Mod'}
          </h2>
          <p className="text-center text-pretty md:w-[20rem]">
            {userData?.isTraitor ? (
              "Your mission is to downvote everyone, sow chaos, and undermine the Mods. But look out - everyone can see if you're liking your own posts and hating on others, so you'll have to be crafty. Don't get caught!"
            ) : (
              "As a Mod, your goal is to maintain peace and order. Identify the Trolls sowing toxic discourse and downvote them into oblivion before they can cause too much chaos. Protect the integrity of the bubble!"
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default Feed;
