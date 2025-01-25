import { useCallback, useEffect, useRef } from 'react';

const SWIPE_DOWN_THRESHOLD = 50;

type Props = {
  isVisible: boolean;
  toggleIsVisible: () => void;
  children: React.ReactNode;
  dismissThreshold?: number;
  disabled?: boolean;
};

const StaticCard = ({ isVisible, toggleIsVisible, children, dismissThreshold = SWIPE_DOWN_THRESHOLD, disabled = false }: Props) => {
  const bodyRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (e: TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (touchStartY.current !== null) {
      const touchY = e.touches[0].clientY;
      const distance = touchY - (touchStartY.current || 0);
      if (distance > dismissThreshold) {
        toggleIsVisible();
      }
    }
  }, [toggleIsVisible, dismissThreshold]);

  const handleTouchEnd = () => {
    touchStartY.current = null;
  };

  useEffect(() => {
    const commentsElement = bodyRef.current;
    if (commentsElement && !disabled) {
      commentsElement.addEventListener('touchstart', handleTouchStart);
      commentsElement.addEventListener('touchmove', handleTouchMove);
      commentsElement.addEventListener('touchend', handleTouchEnd);
    }
    return () => {
      if (commentsElement && !disabled) {
        commentsElement.removeEventListener('touchstart', handleTouchStart);
        commentsElement.removeEventListener('touchmove', handleTouchMove);
        commentsElement.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [handleTouchMove, disabled]);

  useEffect(() => {
    // Manage body overflow based on viewingComments state
    if (isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = '';
    };
  }, [isVisible]);

  return (
    <div
      ref={bodyRef}
      className={`fixed inset-0 bg-white z-50 transform transition-transform 
                  duration-300 ease-in-out
                  ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}
    >
      {children}
    </div>
  );
};

export default StaticCard;
