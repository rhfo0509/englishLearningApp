import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const collection = firestore().collection('bookmarks');

export interface Bookmark {
  chapter: number;
  num: number;
  image: string;
  sounds: string[];
  en: string;
  ko: string;
}

export async function saveBookmarks(category: number, bookmarks: Bookmark[]) {
  const user = auth().currentUser;
  if (!user) {
    throw new Error('User is not logged in');
  }

  const docRef = collection.doc(user.uid);

  try {
    const doc = await collection.doc(user.uid).get();
    const data = doc.exists ? doc.data() : {};

    if (data) {
      data[category] = bookmarks;
      await docRef.set(data);
    }
  } catch (error) {
    console.error('Failed to save bookmarks:', error);
  }
}

export async function getBookmarks(category: number) {
  const user = auth().currentUser;
  if (!user) {
    throw new Error('User is not logged in');
  }

  try {
    const doc = await collection.doc(user.uid).get();

    if (doc.exists) {
      const data = doc.data();
      return data && data[category] ? (data[category] as Bookmark[]) : [];
    } else {
      return [];
    }
  } catch (error) {
    console.error('Failed to get bookmarks:', error);
    return [];
  }
}
