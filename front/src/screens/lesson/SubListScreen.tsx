import React, {useCallback, useLayoutEffect} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import IIcon from 'react-native-vector-icons/Ionicons';
import Header from '../../components/Header';
import useBookmarks from '../../hooks/useBookmarks';

interface Item {
  chapter: number;
  num: number;
  image: string;
  sounds: string[];
  en: string;
  ko: string;
}

const SubListScreen = ({route, navigation}: any) => {
  const {category, title, items} = route.params;
  const {bookmarks, loadBookmarks} = useBookmarks(category);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => <Header />,
    });
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      loadBookmarks();
    }, [loadBookmarks]),
  );

  const renderItem = ({item, index}: {item: Item; index: number}) => {
    const isBookmarked = bookmarks.some(
      bookmark =>
        bookmark.num === item.num && bookmark.chapter === item.chapter,
    );
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() =>
          navigation.navigate('LessonContent', {
            category,
            items,
            title,
            index,
            type: 'normal',
          })
        }>
        <View>
          <Text style={styles.en}>
            [{(index + 1).toString().padStart(2, '0')}] {item.en}
          </Text>
          <Text style={styles.ko}>{item.ko}</Text>
        </View>
        {isBookmarked && (
          <IIcon
            style={styles.bookmark}
            name="bookmark"
            size={24}
            color="#ffd400"
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={{marginTop: 16}}
        data={items}
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
    paddingRight: 32,
    borderRadius: 8,
    marginVertical: 8,
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
  bookmark: {
    position: 'absolute',
    right: 4,
    top: 4,
  },
});
