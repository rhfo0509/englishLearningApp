import {useCallback, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useBookmarkedCategories = () => {
  const [bookmarkedCategories, setBookmarkedCategories] = useState<number[]>(
    [],
  );

  const loadBookmarkedCategories = useCallback(async () => {
    try {
      const data = await AsyncStorage.getItem('bookmarked-categories');
      if (data) {
        setBookmarkedCategories(JSON.parse(data));
      }
    } catch (error) {
      console.error('Failed to load bookmarked categories: ', error);
    }
  }, []);

  useEffect(() => {
    loadBookmarkedCategories();
  }, [loadBookmarkedCategories]);

  const toggleBookmarkedCategory = async (category: number) => {
    const isBookmarked = bookmarkedCategories.includes(category);
    const updated = isBookmarked
      ? bookmarkedCategories.filter(item => item !== category)
      : [...bookmarkedCategories, category];

    try {
      await AsyncStorage.setItem(
        'bookmarked-categories',
        JSON.stringify(updated),
      );
      setBookmarkedCategories(updated);
      console.log('반영됨');
    } catch (error) {
      console.error('Failed to save bookmarked categories:', error);
    }
  };

  return {
    bookmarkedCategories,
    loadBookmarkedCategories,
    toggleBookmarkedCategory,
  };
};

export default useBookmarkedCategories;
