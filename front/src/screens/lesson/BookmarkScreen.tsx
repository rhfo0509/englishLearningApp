import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useLayoutEffect} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import IIcon from 'react-native-vector-icons/Ionicons';

import Header from '../../components/Header';
import useBookmarks from '../../hooks/useBookmarks';
import Toast from 'react-native-toast-message';

interface Bookmark {
  chapter: number;
  num: number;
  image: string;
  sounds: string[];
  en: string;
  ko: string;
}

const BookmarkScreen = ({route, navigation}: any) => {
  const {category, title} = route.params;
  const {bookmarks, loadBookmarks} = useBookmarks(category);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => <Header title={title} />,
    });
  }, [navigation, title]);

  useFocusEffect(
    useCallback(() => {
      loadBookmarks();
    }, [loadBookmarks]),
  );

  const renderItem = ({item, index}: {item: Bookmark; index: number}) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() =>
        navigation.navigate('LessonContent', {
          category,
          items: bookmarks,
          title,
          index,
          type: 'single',
        })
      }>
      <Text style={styles.en}>{item.en}</Text>
      <Text style={styles.ko}>{item.ko}</Text>
    </TouchableOpacity>
  );

  const handleLearning = () => {
    if (bookmarks.length) {
      navigation.navigate('LessonContent', {
        category,
        items: bookmarks,
        title,
        index: 0,
        type: 'normal',
      });
    } else {
      Toast.show({
        type: 'info',
        text1: 'No bookmarks available',
        position: 'bottom',
        visibilityTime: 1500,
      });
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleLearning}>
        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          colors={['#56ab2f', '#a8e063']}
          style={styles.gradient}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
            <IIcon name="play-circle-outline" size={24} color="#fff" />
            <Text style={styles.buttonText}>Play All</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
      <FlatList
        style={{marginTop: 16}}
        data={bookmarks}
        renderItem={renderItem}
        keyExtractor={item => item.num.toString()}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default BookmarkScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eeeff3',
    paddingHorizontal: 16,
  },
  button: {
    borderRadius: 24,
    marginHorizontal: 4,
  },
  gradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
  item: {
    backgroundColor: '#fff',
    padding: 16,
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
});
