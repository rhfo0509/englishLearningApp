import firestore from '@react-native-firebase/firestore';

const collection = firestore().collection('users');

interface User {
  id: string;
  username: string;
  language: string;
  photoURL: string | null;
}

export function createUser(user: User) {
  return collection.doc(user.id).set(user);
}
