import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

interface User {
  id: string;
  username: string;
  photoURL: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({children}: {children: ReactNode}) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const userJson = await AsyncStorage.getItem('user');
        if (userJson) {
          setUser(JSON.parse(userJson));
        }
      } catch (error) {
        console.error('Failed to load user: ', error);
      }
    })();
  }, []);

  const saveUser = async (user: User | null) => {
    try {
      if (user) {
        await AsyncStorage.setItem('user', JSON.stringify(user));
      } else {
        await AsyncStorage.removeItem('user');
      }
      setUser(user);
    } catch (error) {
      console.error('Failed to save user: ', error);
    }
  };

  return (
    <UserContext.Provider value={{user, setUser: saveUser}}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error('UserContext.Provider is not found.');
  }
  return userContext;
};
