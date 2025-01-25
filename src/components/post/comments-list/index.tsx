import { usePostStore } from '../store';
import { useCallback, useEffect, useRef } from 'react';

const CommentsList = () => {
  const { data: { comments }, viewingComments, toggleCommentsView } = usePostStore();
  const commentsRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (e: TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (touchStartY.current !== null) {
      const touchY = e.touches[0].clientY;
      const distance = touchY - (touchStartY.current || 0);
      if (distance > 50) { // Swipe down threshold
        toggleCommentsView();
      }
    }
  }, [toggleCommentsView]);

  const handleTouchEnd = () => {
    touchStartY.current = null;
  };

  useEffect(() => {
    const commentsElement = commentsRef.current;
    if (commentsElement) {
      commentsElement.addEventListener('touchstart', handleTouchStart);
      commentsElement.addEventListener('touchmove', handleTouchMove);
      commentsElement.addEventListener('touchend', handleTouchEnd);
    }
    return () => {
      if (commentsElement) {
        commentsElement.removeEventListener('touchstart', handleTouchStart);
        commentsElement.removeEventListener('touchmove', handleTouchMove);
        commentsElement.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [handleTouchMove]);

  useEffect(() => {
    // Manage body overflow based on viewingComments state
    if (viewingComments) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = '';
    };
  }, [viewingComments]);

  return (
    <div
      ref={commentsRef}
      className={`fixed inset-0 bg-white z-50 transform transition-transform 
                  duration-300 ease-in-out
                  ${viewingComments ? 'translate-y-0' : 'translate-y-full'}`}
    >
      <div className="flex items-center justify-between p-4 border-b-2 border-off-gray">
        <h2 className="text-xl font-bold">Comments</h2>
        <button onClick={toggleCommentsView} className="text-xl font-bold">X</button>
      </div>
      <div className="p-4">
        {comments.map((comment, index) => (
          <div key={index} className="flex flex-col items-start p-2 border-b-2 border-off-gray">
            <h3 className="font-bold">{comment.id}</h3>
            <p>{comment.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsList;
