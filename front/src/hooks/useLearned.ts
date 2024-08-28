import {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Learned {
  [category: number]: {
    [chapter: number]: number[];
  };
}

const useLearned = () => {
  const [learned, setLearned] = useState<Learned>({});

  const loadLearned = async () => {
    try {
      const data = await AsyncStorage.getItem('learned');
      if (data) {
        setLearned(JSON.parse(data));
      }
    } catch (error) {
      console.error('Failed to load last learned data: ', error);
    }
  };

  const saveLearned = async (
    category: number,
    chapter: number,
    index: number,
  ) => {
    try {
      setLearned(prevLearned => {
        const updated = {...prevLearned};

        if (!updated[category]) {
          updated[category] = {};
        }

        if (!updated[category][chapter]) {
          updated[category][chapter] = [];
        }

        if (!updated[category][chapter].includes(index)) {
          updated[category][chapter].push(index);
        }

        AsyncStorage.setItem('learned', JSON.stringify(updated));

        return updated;
      });
    } catch (error) {
      console.error('Failed to save learned data: ', error);
    }
  };

  useEffect(() => {
    loadLearned();
  }, []);

  return {
    learned,
    saveLearned,
    loadLearned,
  };
};

export default useLearned;
