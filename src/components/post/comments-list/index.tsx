import { usePostStore } from '../store';

import StaticCard from '../../static-card';

const CommentsList = () => {
  const { data: { comments }, viewingComments, toggleCommentsView } = usePostStore();

  return (
    <StaticCard isVisible={viewingComments} toggleIsVisible={toggleCommentsView}>
      <div className="flex items-center justify-between p-4 border-b-2 border-off-gray">
        <h2 className="text-xl font-bold">Comments</h2>
        <button onClick={toggleCommentsView} className="text-xl font-bold">X</button>
      </div>
      <div className="p-4">
        {comments.map((comment, index) => (
          <div key={index} className="flex flex-col items-start p-2 border-b-2 border-off-gray">
            <h3 className="font-bold">{comment.id}</h3>
            <p>{comment.content}</p>
          </div>
        ))}
      </div>
    </StaticCard>
  );
};

export default CommentsList;
