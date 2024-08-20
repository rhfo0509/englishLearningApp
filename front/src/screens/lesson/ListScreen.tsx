import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import IIcon from 'react-native-vector-icons/Ionicons';

import Header from '../../components/Header';
import {fetchLearningData} from '../../services/data.service';

interface Chapter {
  num: number;
  category: number;
  chapter: number;
  ko: string;
  type: string;
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

interface Item {
  tnum: number;
  chapter: number;
  num: number;
  image: string;
  sounds: string[];
  en: string;
  ko: string;
}

const ListScreen = ({route, navigation}: any) => {
  const {category, title} = route.params;
  const [loading, setLoading] = useState<boolean>(true);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [items, setItems] = useState<Item[]>([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => <Header />,
    });
  }, [navigation]);

  useEffect(() => {
    // 챕터 리스트
    (async () => {
      try {
        const result = await AsyncStorage.getItem('chapters');
        if (result) {
          const parsed: Chapter[] = JSON.parse(result);
          const filtered = parsed.filter(
            chapter => chapter.category === category,
          );
          const sorted = filtered.sort((a, b) => +a.chapter - +b.chapter);
          setChapters(sorted);
        } else {
          setChapters([]);
        }
      } catch (error) {
        console.error('Error while fetching JSON file', error);
      }
    })();
  }, [category]);

  useEffect(() => {
    // 학습 데이터 리스트
    (async () => {
      try {
        const result = await fetchLearningData(category, navigation);
        setItems(result);
      } catch (error) {
        console.error('Error while fetching JSON file', error);
      } finally {
        setLoading(false);
      }
    })();
  }, [category, navigation]);

  const renderItem = ({item, index}: {item: Chapter; index: number}) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() =>
        navigation.navigate('LessonSubList', {
          category,
          title: item.ko,
          items: items.filter(item => item.chapter === index),
        })
      }>
      <Text style={styles.itemCategory}>{item.ko}</Text>
      <Text style={styles.itemText}>{item.type}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loading}>
          <ActivityIndicator size="large" />
          <Text>학습 데이터 저장 중</Text>
          <Text>잠시만 기다려주세요...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate('LessonContent', {
              category,
              items,
              title,
              type: 'random',
            })
          }>
          <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            colors={['#56ab2f', '#a8e063']}
            style={styles.gradient}>
            <Text style={styles.buttonText}>Random</Text>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
              <IIcon name="shuffle" size={24} color="#fff" />
              <Text style={{color: '#fff'}}>Play Now</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Bookmark', {category, title})}>
          <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            colors={['#1f6feb', '#53c1ff']}
            style={styles.gradient}>
            <Text style={styles.buttonText}>Bookmark</Text>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
              <IIcon name="bookmark-outline" size={24} color="#fff" />
              <Text style={{color: '#fff'}}>Play Now</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      <FlatList
        style={{marginTop: 8}}
        data={chapters}
        renderItem={renderItem}
        keyExtractor={item => item.num.toString()}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default ListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eeeff3',
    paddingHorizontal: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  button: {
    flex: 1,
    height: 80,
    borderRadius: 20,
    marginHorizontal: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    marginLeft: 4,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    borderRadius: 20,
    paddingLeft: 20,
    gap: 8,
  },
  item: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
  },
  itemCategory: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  itemText: {
    color: '#666',
    marginTop: 4,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
