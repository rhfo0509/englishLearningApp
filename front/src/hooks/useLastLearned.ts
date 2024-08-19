import {useCallback, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Item {
  tnum: number;
  chapter: number;
  num: number;
  image: string;
  sounds: string[];
  en: string;
  ko: string;
}

interface LastLearned {
  category: number;
  items: Item[];
  title: string;
  index: number;
}

const useLastLearned = () => {
  const [lastLearned, setLastLearned] = useState<LastLearned | null>(null);

  const loadLastLearned = useCallback(async () => {
    try {
      const data = await AsyncStorage.getItem('lastLearned');
      if (data) {
        setLastLearned(JSON.parse(data));
      }
    } catch (error) {
      console.error('Failed to load last learned data: ', error);
    }
  }, []);

  // Load last learned data when the hook is used
  useEffect(() => {
    loadLastLearned();
  }, [loadLastLearned]);

  const saveLastLearned = useCallback(
    async (category: number, items: Item[], title: string, index: number) => {
      try {
        await AsyncStorage.setItem(
          'lastLearned',
          JSON.stringify({category, items, title, index}),
        );
      } catch (error) {
        console.error('Failed to save last learned data: ', error);
      }
    },
    [],
  );

  return {
    lastLearned,
    loadLastLearned,
    saveLastLearned,
  };
};

export default useLastLearned;
