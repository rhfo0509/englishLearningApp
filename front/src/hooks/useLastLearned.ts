import {useCallback, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import {subscribeAuth} from '../lib/auth';
import {Item, LastLearned, getLastLearned} from '../lib/lastLearned';

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

  // useEffect(() => {
  //   const unsubscribe = subscribeAuth(async user => {
  //     if (user) {
  //       try {
  //         const lastLearned = await getLastLearned();
  //         if (lastLearned) {
  //           setLastLearned(lastLearned);
  //           await AsyncStorage.setItem(
  //             'lastLearned',
  //             JSON.stringify(lastLearned),
  //           );
  //         }
  //       } catch (error) {
  //         console.error(
  //           'Failed to load last learned data from Firestore: ',
  //           error,
  //         );
  //       }
  //     } else {
  //       try {
  //         await AsyncStorage.removeItem('lastLearned');
  //         setLastLearned(null);
  //       } catch (error) {
  //         console.error(
  //           'Failed to sync last learned data to Firestore: ',
  //           error,
  //         );
  //       }
  //     }
  //   });

  //   return () => unsubscribe();
  // }, []);

  return {
    lastLearned,
    loadLastLearned,
    saveLastLearned,
  };
};

export default useLastLearned;
