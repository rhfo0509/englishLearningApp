import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const collection = firestore().collection('lastLearned');

export interface Item {
  chapter: number;
  num: number;
  image: string;
  sounds: string[];
  en: string;
  ko: string;
}

export interface LastLearned {
  category: number;
  chapter: number;
  items: Item[];
  title: string;
  index: number;
}

export async function saveLastLearned(lastLearned: LastLearned) {
  const user = auth().currentUser;
  if (!user) {
    throw new Error('User is not logged in');
  }

  const docRef = collection.doc(user.uid);

  try {
    await docRef.set(lastLearned);
  } catch (error) {
    console.error('Failed to save last learned data:', error);
  }
}

export async function getLastLearned() {
  const user = auth().currentUser;
  if (!user) {
    throw new Error('User is not logged in');
  }

  try {
    const doc = await collection.doc(user.uid).get();

    if (doc.exists) {
      return doc.data() as LastLearned;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Failed to get last learned data:', error);
    return null;
  }
}
