import React from 'react';
import {StyleSheet, View, Image, TouchableOpacity, Text} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import IIcon from 'react-native-vector-icons/Ionicons';
import Settings from './Settings';

const Header = ({title}: {title?: string}) => {
  const navigation = useNavigation();
  const route = useRoute();

  const isHome = route.name === 'Home';

  return (
    <>
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        colors={['#1f6feb', '#53c1ff']}
        style={styles.header}>
        <View style={styles.headerContent}>
          {!isHome && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}>
              <IIcon name="chevron-back" size={32} color="#fff" />
            </TouchableOpacity>
          )}
          {title ? (
            <Text style={styles.title}>{title}</Text>
          ) : (
            <Image
              source={require('../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          )}
          <Settings />
        </View>
      </LinearGradient>
    </>
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
  backButton: {
    marginTop: 4,
    marginRight: 4,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 72,
  },
  logo: {
    width: 120,
    height: 40,
  },
});
