import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useLayoutEffect} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../../components/Header';
import {SENTENCE_CATEGORIES} from '../../common/constants';

interface Category {
  no: number;
  title: string;
}

const CategoryScreen = ({navigation}) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => <Header />,
    });
  }, [navigation]);

  const renderItem = ({item, index}: {item: Category; index: number}) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('SentenceList', {category: item.no})}>
      <LinearGradient
        colors={['#1d6cb9', '#53c1ff']}
        style={styles.indexContainer}>
        <Text style={styles.indexText}>{index + 1}</Text>
      </LinearGradient>
      <Text style={styles.itemText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        style={{marginTop: 16}}
        data={SENTENCE_CATEGORIES}
        renderItem={renderItem}
        keyExtractor={item => item.no.toString()}
      />
    </View>
  );
};

export default CategoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eeeff3',
    paddingHorizontal: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 8,
    elevation: 2,
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
});
