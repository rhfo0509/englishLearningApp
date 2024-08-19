import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useUser} from '../contexts/UserContext';
import {signOut} from '../lib/auth';

const ProfileScreen = () => {
  const {setUser} = useUser();

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleSignOut} style={styles.item}>
        <Text style={styles.itemText}>로그아웃</Text>
      </TouchableOpacity>
    </View>
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
