import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Header from '../../components/Header';

interface Category {
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

const CategoryScreen = ({navigation}: any) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => <Header />,
    });
  }, [navigation]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await AsyncStorage.getItem('categories');
        if (result) {
          const parsed: Category[] = JSON.parse(result);
          const filtered = parsed.filter(category =>
            category.order_by.startsWith('D'),
          );
          const sorted = filtered.sort(
            (a, b) => +a.order_by.slice(1) - +b.order_by.slice(1),
          );
          setCategories(sorted);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error('Error while fetching JSON file', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const renderItem = ({item, index}: {item: Category; index: number}) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() =>
        navigation.navigate('PronunciationList', {category: item.category})
      }>
      <LinearGradient
        colors={['#1f6feb', '#53c1ff']}
        style={styles.indexContainer}>
        <Text style={styles.indexText}>{index + 1}</Text>
      </LinearGradient>
      <Text style={styles.itemText}>{item.ko}</Text>
    </TouchableOpacity>
  );

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
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
