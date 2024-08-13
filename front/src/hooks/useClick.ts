import {useState, useEffect} from 'react';

function useClick(
  actionSimpleClick: () => void,
  actionDoubleClick: () => void,
  delay = 250,
) {
  const [click, setClick] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (click > 0) {
      timer = setTimeout(() => {
        if (click === 1) {
          actionSimpleClick();
        } else if (click === 2) {
          actionDoubleClick();
        }
        setClick(0);
      }, delay);
    }

    // Cleanup the timeout on unmount or when click changes
    return () => clearTimeout(timer);
  }, [click, actionSimpleClick, actionDoubleClick, delay]);

  return () => setClick(prev => prev + 1);
}

export default useClick;
