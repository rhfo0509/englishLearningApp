import firestore from '@react-native-firebase/firestore';

const collection = firestore().collection('users');

interface Item {
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

interface User {
  id: string;
  username: string;
  photoURL: string;
  lastLearned?: LastLearned;
}

export function createUser(user: User) {
  return collection.doc(user.id).set(user);
}

export async function getUser(id: string) {
  try {
    const doc = await collection.doc(id).get();

    return doc.exists ? (doc.data() as User) : null;
  } catch (error) {
    console.error('Failed to get user: ', error);
    return null;
  }
}

export function updateUser(id: string, updated: Partial<User>) {
  return collection.doc(id).update(updated);
}
