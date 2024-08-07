import React, {useLayoutEffect} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useRoute} from '@react-navigation/native';
import Header from '../../components/Header';

const SENTENCES = [
  {
    id: 1,
    category: '묻고 답하기 130선',
    text: 'What time do you go to school?',
  },
  {id: 2, category: '묻고 답하기 130선', text: 'How old is this building?'},
  {id: 3, category: '묻고 답하기 130선', text: 'Which car is yours?'},
  {id: 4, category: '묻고 답하기 130선', text: 'Are they students?'},
  {id: 5, category: '묻고 답하기 130선', text: 'He teaches us English.'},
  {id: 6, category: '묻고 답하기 130선', text: 'Is it rainy today?'},
];

interface Sentence {
  id: number;
  category: string;
  text: string;
}

const SentenceListScreen = ({navigation}) => {
  const route = useRoute();
  const {category} = route.params as {category: number};

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => <Header />,
    });
  }, [navigation]);

  const renderItem = ({item, index}: {item: Sentence; index: number}) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() =>
        navigation.navigate('SentenceSubList', {category, chapter: index})
      }>
      <Text style={styles.itemCategory}>
        {item.category} [{item.id.toString().padStart(2, '0')}]
      </Text>
      <Text style={styles.itemText}>{item.text}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        style={{marginTop: 16}}
        data={SENTENCES}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default SentenceListScreen;

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
