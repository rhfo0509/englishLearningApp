import {useCallback, useEffect, useState} from 'react';
import {Bookmark, getBookmarks, saveBookmarks} from '../lib/bookmarks';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useBookmarks = (category: number) => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  const loadBookmarks = useCallback(async () => {
    try {
      // const data = await getBookmarks(category);
      // setBookmarks(data);
      const data = await AsyncStorage.getItem('bookmarks');
      if (data) {
        setBookmarks(JSON.parse(data)[category] || []);
      } else {
        setBookmarks([]);
      }
    } catch (error) {
      console.error('Failed to load bookmarks: ', error);
      setBookmarks([]);
    }
  }, [category]);

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

  useEffect(() => {
    loadBookmarks();
  }, [loadBookmarks]);

  const toggleBookmark = async (bookmark: Bookmark) => {
    const isBookmarked = bookmarks.some(item => item.num === bookmark.num);
    const updated = isBookmarked
      ? bookmarks.filter(item => item.num !== bookmark.num)
      : [bookmark, ...bookmarks];

    try {
      await saveBookmarks(updated);
      // setBookmarks(updated);
    } catch (error) {
      console.error('Failed to save bookmarks:', error);
    }
  };

  return {bookmarks, loadBookmarks, toggleBookmark};
};

export default useBookmarks;
