import {StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

const Header = () => {
  return (
    <LinearGradient
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}
      colors={['#1d6cb9', '#53c1ff']}
      style={styles.header}>
      <View style={styles.headerContent}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <TouchableOpacity style={styles.language}>
          <Icon name="language" size={24} color="#1a6cb9" />
          {/* <Icon name="trophy-outline" size={24} color="#fff" /> */}
        </TouchableOpacity>
      </View>
      <View style={styles.profile}>
        <View style={styles.profileImage}></View>
        <View style={styles.profileContent}>
          <Text style={styles.profileText}>Hello, Gildong</Text>
          <View style={styles.profileButtons}>
            <View style={styles.profileButton}></View>
            <View style={styles.profileButton}></View>
            <View style={styles.profileButton}></View>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'column',
    height: 200,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingTop: 24,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 40,
  },
  language: {
    marginRight: 8,
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 8,
    elevation: 8,
  },
  profile: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  profileImage: {
    backgroundColor: 'white',
    width: 72,
    height: 72,
    borderRadius: 48,
    marginHorizontal: 4,
  },
  profileContent: {
    gap: 8,
  },
  profileText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 24,
  },
  profileButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  profileButton: {
    width: 72,
    height: 32,
    backgroundColor: 'white',
    borderRadius: 16,
  },
});
