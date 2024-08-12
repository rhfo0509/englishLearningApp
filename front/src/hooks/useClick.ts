import {useState, useEffect} from 'react';

function useClick(
  actionSimpleClick: () => void,
  actionDoubleClick: () => void,
  delay = 250,
) {
  const [click, setClick] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Simple click
      if (click === 1) {
        actionSimpleClick();
      }
      setClick(0);
    }, delay);

    // If two clicks happen within the delay time, consider it a double-click
    if (click === 2) {
      actionDoubleClick();
    }

    // Cleanup the timeout on unmount or when click changes
    return () => clearTimeout(timer);
  }, [click, actionSimpleClick, actionDoubleClick, delay]);

  return () => setClick(prev => prev + 1);
}

export default useClick;
