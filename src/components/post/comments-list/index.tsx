import { usePostStore } from '../store';

import StaticCard from '../../static-card';

const CommentsList = () => {
  const { data: { comments }, viewingComments, toggleCommentsView } = usePostStore();

  return (
    <StaticCard isVisible={viewingComments} toggleIsVisible={toggleCommentsView}>
      <div className="flex items-center justify-between p-4 border-b-2 border-off-gray">
        <button onClick={toggleCommentsView} className="text-xl font-bold">X</button>
        <h2 className="w-full text-xl font-bold text-center">Comments</h2>
      </div>
      <div className="p-4">
        {comments.map((comment, index) => (
          <div key={index} className="flex flex-col items-start p-2 border-b-2 border-off-gray">
            <h3 className="font-bold">{comment.User.name}</h3>
            <p>{comment.content}</p>
          </div>
        ))}
      </div>
    </StaticCard>
  );
};

export default CommentsList;
