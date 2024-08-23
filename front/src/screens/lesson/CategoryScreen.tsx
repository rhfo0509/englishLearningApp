import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useLayoutEffect} from 'react';
import LinearGradient from 'react-native-linear-gradient';

import Header from '../../components/Header';

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

const CategoryScreen = ({route, navigation}: any) => {
  const {categories, title} = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => <Header title={title} />,
    });
  }, [navigation, title]);

  const renderItem = ({item, index}: {item: Category; index: number}) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() =>
        navigation.navigate('LessonList', {
          category: item.category,
          title: item.ko,
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

  return (
    <View style={styles.container}>
      <FlatList
        style={{marginTop: 16}}
        data={categories}
        renderItem={renderItem}
        keyExtractor={item => item.category.toString()}
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
