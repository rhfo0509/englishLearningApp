import React from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useUser} from '../contexts/UserContext';
import Avatar from './Avatar';

const Profile = () => {
  const {user} = useUser();
  return (
    <LinearGradient
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}
      colors={['#1f6feb', '#53c1ff']}
      style={styles.profileContainer}>
      <View style={styles.profile}>
        <View style={styles.profileImage}>
          <Avatar source={user?.photoURL} size={72} />
        </View>
        <View style={styles.profileContent}>
          <Text style={styles.profileText}>Hello, {user?.username}</Text>
          <View style={styles.profileButtons}>
            <View style={styles.profileButton}>
              <Icon name="police-badge-outline" size={20} color="#fff" />
              <Text style={{color: '#fff'}}>0</Text>
            </View>
            <View style={styles.profileButton}>
              <Icon name="cash-100" size={20} color="#fff" />
              <Text style={{color: '#fff'}}>0</Text>
            </View>
            <View style={styles.profileButton}>
              <Icon name="trophy-outline" size={20} color="#fff" />
              <Text style={{color: '#fff'}}>4402</Text>
            </View>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    paddingBottom: 16,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginHorizontal: -16,
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'white',
    marginRight: 16,
  },
  profileContent: {
    gap: 8,
  },
  profileText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  profileButton: {
    width: 64,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 8,
  },
});

export default Profile;
