import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import React, {useLayoutEffect} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../components/Header';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HomeScreen = ({navigation}) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => <Header />,
    });
  }, [navigation]);
  return (
    <SafeAreaView style={styles.container}>
      {/* <ScrollView style={styles.scrollView}> */}
      <View style={styles.resume}></View>
      <View>
        <View style={styles.title}>
          <Icon name="menu-book" size={36} />
          <Text style={styles.titleText}>Learning Zone</Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity style={styles.learningButton}>
            <View style={styles.iconContainer}>
              <Image source={require('../assets/sentence.png')} />
            </View>
            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              colors={['#1d6cb9', '#53c1ff']}
              style={[
                styles.gradient,
                {borderTopLeftRadius: 0, borderTopRightRadius: 0},
              ]}>
              <Text style={styles.buttonText}>Sentence</Text>
              <Text style={styles.buttonSubText}>5 Categories</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={styles.learningButton}>
            <View style={styles.iconContainer}>
              <Image source={require('../assets/situation.png')} />
            </View>
            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              colors={['#1d6cb9', '#53c1ff']}
              style={[
                styles.gradient,
                {borderTopLeftRadius: 0, borderTopRightRadius: 0},
              ]}>
              <Text style={styles.buttonText}>Situation</Text>
              <Text style={styles.buttonSubText}>3 Categories</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={styles.learningButton}>
            <View style={styles.iconContainer}>
              <Image source={require('../assets/word.png')} />
            </View>
            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              colors={['#1d6cb9', '#53c1ff']}
              style={[
                styles.gradient,
                {borderTopLeftRadius: 0, borderTopRightRadius: 0},
              ]}>
              <Text style={styles.buttonText}>Word</Text>
              <Text style={styles.buttonSubText}>7 Categories</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{marginTop: 12}}>
        <View style={styles.title}>
          <Icon name="flaky" size={36} />
          <Text style={styles.titleText}>Challenge Zone</Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity style={styles.challengeButton}>
            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              colors={['#498851', '#b6d3b6']}
              style={styles.gradient}>
              <Text style={[styles.buttonText, {fontSize: 20}]}>
                Infinite Mode
              </Text>
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
                <Icon name="play-circle-outline" size={24} color="#fff" />
                <Text style={styles.buttonSubText}>Play Now</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={styles.challengeButton}>
            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              colors={['#1d6cb9', '#53c1ff']}
              style={styles.gradient}>
              <Text style={[styles.buttonText, {fontSize: 20}]}>
                General Mode
              </Text>
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
                <Icon name="play-circle-outline" size={24} color="#fff" />
                <Text style={styles.buttonSubText}>Play Now</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
      {/* </ScrollView> */}
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eeeff3',
    marginHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    height: 200,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  resume: {
    marginVertical: 24,
    borderRadius: 24,
    height: 160,
    backgroundColor: '#fff',
    elevation: 8,
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  learningButton: {
    flex: 1,
    height: 160,
    marginHorizontal: 4,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 8,
  },
  challengeButton: {
    flex: 1,
    height: 100,
    borderRadius: 24,
    marginHorizontal: 4,
    elevation: 8,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    borderRadius: 24,
    padding: 12,
    gap: 8,
  },
  iconContainer: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    height: 100,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  buttonSubText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
});
