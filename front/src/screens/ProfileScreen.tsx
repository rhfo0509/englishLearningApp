import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useUser} from '../contexts/UserContext';
// import {signOut} from '../lib/auth';
import {saveLastLearned} from '../lib/lastLearned';

const ProfileScreen = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const {setUser} = useUser();

  const handleSignOut = async () => {
    try {
      setLoading(true);
      const data = await AsyncStorage.getItem('lastLearned');
      if (data) {
        await saveLastLearned(JSON.parse(data));
      }
      // await signOut();
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      setUser(null);
    } catch (error) {
      console.error('Failed to handle logout: ', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loading}>
          <ActivityIndicator size="large" />
        </View>
      </View>
    );
  }

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
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
