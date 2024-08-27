import {SafeAreaView, StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import {useUser} from '../contexts/UserContext';
import {signOut} from '../lib/auth';
import {updateUser} from '../lib/user';

const ProfileScreen = () => {
  const {setUser} = useUser();

  const handleSignOut = async () => {
    try {
      const data = await AsyncStorage.getItem('lastLearned');
      if (data) {
        const user = auth().currentUser;
        if (user) {
          await updateUser(user.uid, {lastLearned: JSON.parse(data)});
        }
      }
    } catch (error) {
      console.error('Failed to handle logout: ', error);
    }
    await signOut();
    setUser(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={handleSignOut} style={styles.item}>
        <Text style={styles.itemText}>로그아웃</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eeeff3',
    paddingTop: 32,
  },
  item: {
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  itemText: {
    fontSize: 16,
  },
});
