import firestore from '@react-native-firebase/firestore';

const collection = firestore().collection('users');

interface User {
  id: string;
  username: string;
  language: string;
  photoURL: string;
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
