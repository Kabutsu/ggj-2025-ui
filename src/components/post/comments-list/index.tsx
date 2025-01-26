import { useMemo, useState } from 'react';

import type { Comment, Dislike, Like } from '../../../api/posts';
import { useUser } from '../../../api/users';

import { usePostStore } from '../store';

import StaticCard from '../../static-card';
import { CommentsIcon, CommentsIconFilled, ThumbDownIcon, ThumbDownIconFilled, ThumbUpIcon, ThumbUpIconFilled } from '../../icons';

const CommentDetails = ({ comment }: { comment: Comment }) => {
  const { data, isLoading } = useUser(comment.userId, comment.User);

  return (
    <div className="flex flex-col items-start p-2 border-b-2 border-off-gray">
      <div className="flex items-center justify-start gap-2">
        <img
          src={isLoading || !data ? '' : data.profileUrl}
          alt={isLoading || !data ? 'Loading...' : `${data.name}'s profile picture`}
          className="w-8 h-8 rounded-full"
        />
        <h3 className="font-bold">{isLoading || !data ? 'Loading...' : data.name}</h3>
      </div>
      <p>{comment.content}</p>
    </div>
  );
}

const ReactionDetails = ({ reaction }: { reaction: Like | Dislike }) => {
  const { data, isLoading } = useUser(reaction.userId, reaction.User);

  return (
    <div className="flex items-center justify-start gap-3 p-2 border-b-2 border-off-gray">
      <img
        src={isLoading || !data ? '' : data.profileUrl}
        alt={isLoading || !data ? 'Loading...' : `${data.name}'s profile picture`}
        className="w-8 h-8 rounded-full"
      />
      <h3 className="font-bold">{isLoading || !data ? 'Loading...' : data.name}</h3>
    </div>
  );
};

const CommentsList = () => {
  const { data: { comments, likes, dislikes }, viewingComments, toggleCommentsView } = usePostStore();

  const [viewing, setViewing] = useState<'Comments' | 'Likes' | 'Dislikes'>('Comments');

  const content = useMemo(() => {
    switch(viewing) {
      case 'Comments':
        return comments.map((comment, index) => (
          <CommentDetails key={index} comment={comment} />
        ));
      case 'Likes':
        return likes.map((like, index) => (
          <ReactionDetails key={index} reaction={like} />
        ));
      case 'Dislikes':
        return dislikes.map((dislike, index) => (
          <ReactionDetails key={index} reaction={dislike} />
        ));
    }
  }, [comments, likes, dislikes, viewing]);

  return (
    <StaticCard isVisible={viewingComments} toggleIsVisible={toggleCommentsView}>
      <div className="flex items-center justify-between p-4 border-b-2 border-off-gray">
        <button onClick={toggleCommentsView} className="text-xl font-bold">X</button>
        <h2 className="w-full text-xl font-bold text-center">{viewing}</h2>
        <div className="flex items-center gap-3 md:gap-5">
          <button onClick={() => setViewing('Comments')}>
            {viewing === 'Comments' ? <CommentsIconFilled className="w-6 h-6" /> : <CommentsIcon className="w-6 h-6" />}
          </button>
          <button onClick={() => setViewing('Likes')}>
            {viewing === 'Likes' ? <ThumbUpIconFilled className="w-6 h-6" /> : <ThumbUpIcon className="w-6 h-6" />}
          </button>
          <button onClick={() => setViewing('Dislikes')}>
            {viewing === 'Dislikes' ? <ThumbDownIconFilled className="w-6 h-6" /> : <ThumbDownIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>
      <div className="p-4">
        {content}
      </div>
    </StaticCard>
  );
};

export default CommentsList;
