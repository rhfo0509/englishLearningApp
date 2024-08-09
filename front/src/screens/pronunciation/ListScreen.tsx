import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Header from '../../components/Header';
import {checkAndUpdateJSON} from '../../services/file.service';

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

interface Pronunciation {
  chapter: number;
  num: number;
  image: string;
  sounds: string[];
  en: string;
  ko: string;
}

const ListScreen = ({navigation}) => {
  const route = useRoute();
  const {category} = route.params as {category: number};
  const [loading, setLoading] = useState<boolean>(true);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [pronunciations, setPronunciations] = useState<Pronunciation[]>([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => <Header />,
    });
  }, [navigation]);

  useEffect(() => {
    const fetchChapters = async () => {
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
    };
    fetchChapters();
  }, [category]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await checkAndUpdateJSON(category, navigation);
        setPronunciations(result);
      } catch (error) {
        console.error('Error while fetching JSON file', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [category, navigation]);

  const renderItem = ({item, index}: {item: Chapter; index: number}) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() =>
        navigation.navigate('PronunciationSubList', {
          title: item.ko,
          pronunciations: pronunciations.filter(
            pronunciation => pronunciation.chapter === index,
          ),
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
      <FlatList
        style={{marginTop: 16}}
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
  item: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    elevation: 2,
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
