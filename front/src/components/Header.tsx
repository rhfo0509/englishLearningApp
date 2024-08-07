import React from 'react';
import {StyleSheet, View, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import LanguageButton from './LanguageButton';

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
        <LanguageButton />
      </View>
    </LinearGradient>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    height: 72,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
  },
  logo: {
    width: 100,
    height: 40,
  },
});
