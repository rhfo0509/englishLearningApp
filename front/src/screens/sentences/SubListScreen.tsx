import React, {useState, useEffect, useLayoutEffect} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import {useRoute} from '@react-navigation/native';

import {checkAndUpdateJSON} from '../../services/file.service';
import Header from '../../components/Header';

interface Sentence {
  num: number;
  image: string;
  sounds: string[];
  en: string;
  ko: string;
}

const SubListScreen = ({navigation}) => {
  const route = useRoute();
  const {category, chapter} = route.params as {
    category: number;
    chapter: number;
  };
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
        const result = await checkAndUpdateJSON(category, chapter);
        setSentences(result);
        setLoading(false);
      } catch (error) {
        console.error('Error while fetching JSON file', error);
      }
    };
    fetchData();
  }, [category, chapter]);

  const renderItem = ({item, index}: {item: Sentence; index: number}) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() =>
        navigation.navigate('SentenceLesson', {
          index,
          sentences,
        })
      }>
      <Text style={styles.en}>
        [{item.num.toString().padStart(2, '0')}] {item.en}
      </Text>
      <Text style={styles.ko}>{item.ko}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator style={styles.loading} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        style={{marginTop: 16}}
        data={sentences}
        renderItem={renderItem}
        keyExtractor={item => item.num.toString()}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default SubListScreen;

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
  en: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  ko: {
    color: '#666',
    marginTop: 4,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
