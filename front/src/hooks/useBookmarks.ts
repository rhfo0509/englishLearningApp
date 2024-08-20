import {useCallback, useEffect, useState} from 'react';
import {Bookmark, getBookmarks, saveBookmarks} from '../lib/bookmarks';

const useBookmarks = (category: number) => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  // 북마크를 로드하는 함수
  const loadBookmarks = useCallback(async () => {
    try {
      const loaded = await getBookmarks(category);
      setBookmarks(loaded);
    } catch (error) {
      console.error('Failed to load bookmarks: ', error);
    }
  }, [category]);

  // 컴포넌트가 마운트되거나 카테고리가 변경될 때 북마크를 로드
  useEffect(() => {
    loadBookmarks();
  }, [loadBookmarks]);

  // 북마크를 토글하는 함수
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
