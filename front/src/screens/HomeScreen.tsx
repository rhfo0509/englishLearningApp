import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  FlatList,
  Alert,
  BackHandler,
} from 'react-native';
import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Header from '../components/Header';
import Profile from '../components/Profile';
import useLastLearned from '../hooks/useLastLearned';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Category {
  recommend: number;
  order_by: string;
  category: number;
  ko: string;
  en: string;
  ja: string;
  zh: string;
  zh_TW: string;
  id: string;
  ms: string;
  vn: string;
  ru: string;
  es: string;
  pt: string;
}

const learningButtons = [
  {
    title: 'Sentence',
    image: require('../assets/sentence.png'),
    filter: 'A',
  },
  {
    title: 'Situation',
    image: require('../assets/situation.png'),
    filter: 'B',
  },
  {
    title: 'Word',
    image: require('../assets/word.png'),
    filter: 'C',
  },
  {
    title: 'Pronunciation',
    image: require('../assets/pronunciation.png'),
    filter: 'D',
  },
  {
    title: 'Q&A 100',
    image: require('../assets/qna100.png'),
    filter: 'E',
  },
];

const HomeScreen = ({navigation}: any) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [recommended, setRecommended] = useState<Category[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const {lastLearned, loadLastLearned} = useLastLearned();

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => <Header />,
    });
  }, [navigation]);

  useEffect(() => {
    (async () => {
      try {
        const result = await AsyncStorage.getItem('categories');
        if (result) {
          const parsed: Category[] = JSON.parse(result);
          setCategories(parsed);
          const recommended = parsed
            .filter(category => category.recommend)
            .sort((a, b) => a.recommend - b.recommend);
          setRecommended(recommended);
        } else {
          setRecommended([]);
        }
      } catch (error) {
        console.error('Error while fetching general data', error);
      } finally {
        setLoading(false);
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
          index: lastLearned.index,
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

  useEffect(() => {
    const handleBackPress = () => {
      Alert.alert('EXIT', 'Are you sure you want to exit?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {
          text: 'Exit',
          onPress: () => {
            BackHandler.exitApp();
          },
        },
      ]);
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, [navigation]);

  const renderItem = ({item, index}: {item: Category; index: number}) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() =>
        navigation.navigate('LessonStack', {
          screen: 'LessonList',
          params: {category: item.category, title: item.ko},
        })
      }>
      <LinearGradient
        colors={['#1f6feb', '#53c1ff']}
        style={styles.indexContainer}>
        <Text style={styles.indexText}>{index + 1}</Text>
      </LinearGradient>
      <Text style={styles.itemText}>{item.ko}</Text>
    </TouchableOpacity>
  );

  const renderLearningButtons = () => {
    return learningButtons.map((button, index) => {
      const filteredCategories = categories
        .filter(category => category.order_by.startsWith(button.filter))
        .sort((a, b) => +a.order_by.slice(1) - +b.order_by.slice(1));

      return (
        <TouchableOpacity
          key={index}
          style={styles.learningButton}
          onPress={() =>
            navigation.navigate('LessonStack', {
              screen: 'LessonCategory',
              params: {categories: filteredCategories, title: button.title},
            })
          }>
          <View style={styles.iconContainer}>
            <Image source={button.image} />
          </View>
          <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            colors={['#1f6feb', '#53c1ff']}
            style={[
              styles.gradient,
              {borderTopLeftRadius: 0, borderTopRightRadius: 0},
            ]}>
            <Text style={styles.buttonText}>{button.title}</Text>
            <Text style={styles.buttonSubText}>
              {filteredCategories.length} Categories
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      );
    });
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
      <Profile />
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={styles.resume}
          onPress={handleContinueLearning}>
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
            {renderLearningButtons()}
          </ScrollView>
        </View>
        <View style={{marginTop: 12}}>
          <View style={styles.title}>
            <Icon name="recommend" size={36} />
            <Text style={styles.titleText}>Recommended</Text>
          </View>
          <FlatList
            data={recommended}
            renderItem={renderItem}
            keyExtractor={item => item.category.toString()}
            scrollEnabled={false}
          />
        </View>
        <View>
          <View style={styles.title}>
            <Icon name="stars" size={36} />
            <Text style={styles.titleText}>Bookmarked Categories</Text>
          </View>
          {/* <FlatList
            data={recommended}
            renderItem={renderItem}
            keyExtractor={item => item.category.toString()}
            scrollEnabled={false}
          /> */}
        </View>
      </ScrollView>
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
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
  },
  indexContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  indexText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  itemText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 32,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
