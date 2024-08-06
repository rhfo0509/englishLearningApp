import React from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Profile = () => {
  return (
    <LinearGradient
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}
      colors={['#1d6cb9', '#53c1ff']}
      style={styles.profileContainer}>
      <View style={styles.profile}>
        <View style={styles.profileImage}></View>
        <View style={styles.profileContent}>
          <Text style={styles.profileText}>Hello, Gildong</Text>
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
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginHorizontal: -16,
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    marginRight: 16,
  },
  profileContent: {
    gap: 8,
  },
  profileText: {
    fontSize: 18,
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
