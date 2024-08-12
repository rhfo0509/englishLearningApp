import React, {useLayoutEffect} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import Header from '../../components/Header';

interface Sentence {
  chapter: number;
  num: number;
  image: string;
  sounds: string[];
  en: string;
  ko: string;
}

const SubListScreen = ({route, navigation}: any) => {
  const {title, sentences} = route.params as {
    title: string;
    sentences: Sentence[];
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => <Header />,
    });
  }, [navigation]);

  const renderItem = ({item, index}: {item: Sentence; index: number}) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() =>
        navigation.navigate('SentenceLesson', {
          sentences,
          title,
          index,
          from: 'sublist',
        })
      }>
      <Text style={styles.en}>
        [{(item.num + 1).toString().padStart(2, '0')}] {item.en}
      </Text>
      <Text style={styles.ko}>{item.ko}</Text>
    </TouchableOpacity>
  );

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
});
