import React, {useLayoutEffect} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useRoute} from '@react-navigation/native';
import Header from '../../components/Header';
import {SENTENCES_CHAPTERS} from '../../common/constants';

interface Chapter {
  id: number;
  category: string;
  text: string;
}

const ListScreen = ({navigation}) => {
  const route = useRoute();
  const {category} = route.params as {category: number};

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => <Header />,
    });
  }, [navigation]);

  const renderItem = ({item, index}: {item: Chapter; index: number}) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() =>
        navigation.navigate('SentenceSubList', {
          category,
          chapter: index,
          title: item.category,
        })
      }>
      <Text style={styles.itemCategory}>{item.category}</Text>
      <Text style={styles.itemText}>{item.text}</Text>
    </TouchableOpacity>
  );

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
});
