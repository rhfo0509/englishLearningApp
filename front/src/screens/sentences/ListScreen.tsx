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
import Header from '../../components/Header';
import {SENTENCES_CHAPTERS} from '../../common/constants';
import {checkAndUpdateJSON} from '../../services/file.service';

interface Chapter {
  id: number;
  category: string;
  text: string;
}

interface Sentence {
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
  const [sentences, setSentences] = useState<Sentence[]>([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => <Header />,
    });
  }, [navigation]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await checkAndUpdateJSON(category);
        setSentences(result);
        setLoading(false);
      } catch (error) {
        console.error('Error while fetching JSON file', error);
      }
    };
    fetchData();
  }, [category]);

  const renderItem = ({item, index}: {item: Chapter; index: number}) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() =>
        navigation.navigate('SentenceSubList', {
          title: item.category,
          sentences: sentences.filter(sentence => sentence.chapter === index),
        })
      }>
      <Text style={styles.itemCategory}>{item.category}</Text>
      <Text style={styles.itemText}>{item.text}</Text>
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
        data={SENTENCES_CHAPTERS}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
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
