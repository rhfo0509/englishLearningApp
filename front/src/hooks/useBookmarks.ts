import {useCallback, useEffect, useState} from 'react';
import {Bookmark, getBookmarks, saveBookmarks} from '../lib/bookmarks';

const useBookmarks = (category: number) => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  const loadBookmarks = useCallback(async () => {
    try {
      const data = await getBookmarks(category);
      setBookmarks(data);
    } catch (error) {
      console.error('Failed to load bookmarks: ', error);
    }
  }, [category]);

  useEffect(() => {
    loadBookmarks();
  }, [loadBookmarks]);

  const toggleBookmark = async (bookmark: Bookmark) => {
    const isBookmarked = bookmarks.some(item => item.num === bookmark.num);
    const updated = isBookmarked
      ? bookmarks.filter(item => item.num !== bookmark.num)
      : [bookmark, ...bookmarks];

    try {
      await saveBookmarks(category, updated);
      setBookmarks(updated);
    } catch (error) {
      console.error('Failed to save bookmarks:', error);
    }
  };

  return {bookmarks, loadBookmarks, toggleBookmark};
};

export default useBookmarks;
