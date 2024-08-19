import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import React, {useCallback, useEffect, useLayoutEffect} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Header from '../components/Header';
import Profile from '../components/Profile';
import useLastLearned from '../hooks/useLastLearned';
import {fetchGeneralData} from '../services/data.service';

const HomeScreen = ({navigation}: any) => {
  const {lastLearned, loadLastLearned} = useLastLearned();

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => <Header />,
    });
  }, [navigation]);

  useEffect(() => {
    (async () => {
      try {
        await fetchGeneralData();
      } catch (error) {
        console.error('Error while fetching general data', error);
      }
    })();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadLastLearned();
    }, [loadLastLearned]),
  );

  const handleContinueLearning = () => {
    if (lastLearned) {
      navigation.navigate('LessonStack', {
        screen: 'LessonContent',
        params: {
          category: lastLearned.category,
          items: lastLearned.items,
          title: lastLearned.title,
          index: lastLearned.index - lastLearned.items[0].tnum,
          type: 'normal',
        },
      });
    } else {
      Toast.show({
        type: 'info',
        text1: 'No recent learning data to continue',
        position: 'bottom',
        visibilityTime: 1500,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Profile />
      <TouchableOpacity style={styles.resume} onPress={handleContinueLearning}>
        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          colors={['#56ab2f', '#a8e063']}
          style={{borderRadius: 24, padding: 16}}>
          <View style={styles.resumeContent}>
            <Icon name="history" size={36} color="#fff" />
            <View style={{marginLeft: 16}}>
              <Text style={styles.resumeTitle}>Continue Learning</Text>
              <Text style={styles.resumeSubtitle}>
                {lastLearned
                  ? `${lastLearned.title} / No. ${lastLearned.index + 1}`
                  : 'No recent activity'}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
      <View>
        <View style={styles.title}>
          <Icon name="menu-book" size={36} />
          <Text style={styles.titleText}>Learning Zone</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={styles.learningButton}
            onPress={() =>
              navigation.navigate('LessonStack', {
                screen: 'LessonCategory',
                params: {orderBy: 'A'},
              })
            }>
            <View style={styles.iconContainer}>
              <Image source={require('../assets/sentence.png')} />
            </View>
            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              colors={['#1f6feb', '#53c1ff']}
              style={[
                styles.gradient,
                {borderTopLeftRadius: 0, borderTopRightRadius: 0},
              ]}>
              <Text style={styles.buttonText}>Sentence</Text>
              <Text style={styles.buttonSubText}>5 Categories</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.learningButton}
            // onPress={() =>
            //   navigation.navigate('LessonStack', {
            //     screen: 'LessonCategory',
            //     params: {orderBy: 'B'},
            //   })
            // }
          >
            <View style={styles.iconContainer}>
              <Image source={require('../assets/situation.png')} />
            </View>
            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              colors={['#1f6feb', '#53c1ff']}
              style={[
                styles.gradient,
                {borderTopLeftRadius: 0, borderTopRightRadius: 0},
              ]}>
              <Text style={styles.buttonText}>Situation</Text>
              <Text style={styles.buttonSubText}>3 Categories</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.learningButton}
            // onPress={() =>
            //   navigation.navigate('LessonStack', {
            //     screen: 'LessonCategory',
            //     params: {orderBy: 'C'},
            //   })
            // }
          >
            <View style={styles.iconContainer}>
              <Image source={require('../assets/word.png')} />
            </View>
            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              colors={['#1f6feb', '#53c1ff']}
              style={[
                styles.gradient,
                {borderTopLeftRadius: 0, borderTopRightRadius: 0},
              ]}>
              <Text style={styles.buttonText}>Word</Text>
              <Text style={styles.buttonSubText}>7 Categories</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.learningButton}
            onPress={() =>
              navigation.navigate('LessonStack', {
                screen: 'LessonCategory',
                params: {orderBy: 'D'},
              })
            }>
            <View style={styles.iconContainer}>
              <Image source={require('../assets/pronunciation.png')} />
            </View>
            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              colors={['#1f6feb', '#53c1ff']}
              style={[
                styles.gradient,
                {borderTopLeftRadius: 0, borderTopRightRadius: 0},
              ]}>
              <Text style={styles.buttonText}>Pronunciation</Text>
              <Text style={styles.buttonSubText}>2 Categories</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.learningButton}
            onPress={() =>
              navigation.navigate('LessonStack', {
                screen: 'LessonCategory',
                params: {orderBy: 'E'},
              })
            }>
            <View style={styles.iconContainer}>
              <Image source={require('../assets/qna100.png')} />
            </View>
            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              colors={['#1f6feb', '#53c1ff']}
              style={[
                styles.gradient,
                {borderTopLeftRadius: 0, borderTopRightRadius: 0},
              ]}>
              <Text style={styles.buttonText}>Q&A 100</Text>
              <Text style={styles.buttonSubText}>1 Categories</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
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
              colors={['#1f6feb', '#53c1ff']}
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
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eeeff3',
    paddingHorizontal: 16,
  },
  resume: {
    marginVertical: 24,
    borderRadius: 24,
    elevation: 8,
  },
  resumeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resumeTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resumeSubtitle: {
    color: '#fff',
    fontSize: 14,
    marginTop: 4,
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
    width: 140,
    height: 160,
    marginHorizontal: 4,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 4,
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    height: 100,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
  },
  buttonSubText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
});
