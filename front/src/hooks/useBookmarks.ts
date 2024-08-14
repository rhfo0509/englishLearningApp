import {useCallback, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Bookmark {
  tnum: number;
  chapter: number;
  num: number;
  image: string;
  sounds: string[];
  en: string;
  ko: string;
}

const useBookmarks = (category: number) => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  const loadBookmarks = useCallback(async () => {
    try {
      const storedData = await AsyncStorage.getItem('bookmarks');
      if (storedData) {
        const data = JSON.parse(storedData);
        setBookmarks(data[category] || []);
        console.log(data);
      }
    } catch (error) {
      console.error('Failed to load bookmarks: ', error);
    }
  }, [category]);

  // Load bookmarks when the hook is used
  useEffect(() => {
    loadBookmarks();
  }, [loadBookmarks]);

  const saveBookmarks = async (updated: Bookmark[]) => {
    try {
      const storedData = await AsyncStorage.getItem('bookmarks');
      const data = storedData ? JSON.parse(storedData) : {};
      data[category] = updated;
      await AsyncStorage.setItem('bookmarks', JSON.stringify(data));
      setBookmarks(updated);
    } catch (error) {
      console.error('Failed to save bookmarks:', error);
    }
  };

  const toggleBookmark = async (bookmark: Bookmark) => {
    const isBookmarked = bookmarks.some(item => item.num === bookmark.num);
    const updated = isBookmarked
      ? bookmarks.filter(item => item.num !== bookmark.num)
      : [...bookmarks, bookmark];
    await saveBookmarks(updated);
  };

  return {bookmarks, loadBookmarks, toggleBookmark};
};

export default useBookmarks;
