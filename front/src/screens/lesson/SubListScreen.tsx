import React, {useEffect, useLayoutEffect, useRef} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import IIcon from 'react-native-vector-icons/Ionicons';

import Header from '../../components/Header';
import useBookmarks from '../../hooks/useBookmarks';
import useLearned from '../../hooks/useLearned';
import useLastLearned from '../../hooks/useLastLearned';

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
  const {learned, loadLearned} = useLearned();
  const {lastLearned, loadLastLearned} = useLastLearned();
  const listRef = useRef<FlatList>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => <Header title={title} />,
    });
  }, [navigation, title]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadBookmarks();
      loadLearned();
      loadLastLearned();
    });

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!lastLearned || lastLearned.category !== category || !listRef.current) {
      return;
    }

    const indexToScroll = items.findIndex(
      item =>
        item.chapter === lastLearned.chapter && item.num === lastLearned.index,
    );

    if (indexToScroll !== -1) {
      listRef.current.scrollToIndex({
        animated: true,
        index: indexToScroll,
      });
    }
  }, [lastLearned, category, items]);

  const renderItem = ({item, index}: {item: Item; index: number}) => {
    const isBookmarked = bookmarks.some(
      bookmark =>
        bookmark.num === item.num && bookmark.chapter === item.chapter,
    );

    const isLearned = learned[category]?.[item.chapter]?.includes(item.num);

    const isLastLearned =
      lastLearned?.category === category &&
      lastLearned?.chapter === item.chapter &&
      lastLearned?.index === item.num;

    return (
      <TouchableOpacity
        style={[styles.item, isLearned && {opacity: 0.5}]}
        onPress={() =>
          navigation.navigate('LessonContent', {
            category,
            chapter: item.chapter,
            items,
            title,
            index,
            type: 'normal',
          })
        }>
        <View>
          <Text style={[styles.en, isLastLearned && {color: '#1f6feb'}]}>
            [{(index + 1).toString().padStart(2, '0')}] {item.en}
          </Text>
          <Text style={[styles.ko, isLastLearned && {color: '#1f6feb'}]}>
            {item.ko}
          </Text>
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
        ref={listRef}
        style={{marginTop: 16}}
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item.num.toString()}
        showsVerticalScrollIndicator={false}
        onScrollToIndexFailed={info => {
          const wait = new Promise(resolve => setTimeout(resolve, 500));
          wait.then(() => {
            listRef.current?.scrollToIndex({
              index: info.index,
              animated: true,
            });
          });
        }}
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
