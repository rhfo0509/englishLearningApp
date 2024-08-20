import React, {useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  PanResponder,
  Pressable,
  Animated,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import RNFS from 'react-native-fs';
import SoundPlayer from 'react-native-sound-player';
import FastImage from 'react-native-fast-image';
import IIcon from 'react-native-vector-icons/Ionicons';
import MIcon from 'react-native-vector-icons/MaterialIcons';

import {DEFAULT_IMAGE_PATHS} from '../../common/constants';
import useClick from '../../hooks/useClick';
import useBookmarks from '../../hooks/useBookmarks';
import useLastLearned from '../../hooks/useLastLearned';
import {readLocalJSON} from '../../services/json.service';

const {width} = Dimensions.get('window');

interface Item {
  tnum: number;
  chapter: number;
  num: number;
  image: string;
  sounds: string[];
  en: string;
  ko: string;
}

const ContentScreen = ({route, navigation}: any) => {
  const {
    category,
    items,
    title,
    index = Math.floor(Math.random() * items.length),
    type,
  } = route.params as {
    category: number;
    items: Item[];
    title: string;
    index: number;
    type: string;
  };

  const [currentIndex, setCurrentIndex] = useState<number>(index);
  const [playing, setPlaying] = useState<boolean>(true);
  const [soundIndex, setSoundIndex] = useState<number>(0);

  const [viewMode, setViewMode] = useState<{
    english: boolean;
    translation: boolean;
  }>({
    english: true,
    translation: true,
  });

  const [repeatMode, setRepeatMode] = useState<'always' | 'once' | 'none'>(
    type === 'single' ? 'once' : 'always',
  );
  const [shuffleMode, setShuffleMode] = useState<boolean>(type === 'random');
  const [shuffleIndexes, setShuffleIndexes] = useState<number[]>([]);

  const [imageUri, setImageUri] = useState<string | number>('');

  const getRandomGif = () => {
    const randomIndex = Math.floor(Math.random() * DEFAULT_IMAGE_PATHS.length);
    return DEFAULT_IMAGE_PATHS[randomIndex];
  };

  useEffect(() => {
    setImageUri(
      items[currentIndex].image
        ? `file://${items[currentIndex].image}`
        : getRandomGif(),
    );
  }, [currentIndex, items]);

  const [iconOpacity] = useState<Animated.Value>(new Animated.Value(0));
  const showIcon = useCallback(
    (icon: 'play' | 'pause') => {
      Animated.sequence([
        Animated.timing(iconOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.delay(500),
        Animated.timing(iconOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    },
    [iconOpacity],
  );

  const playSound = (soundUrl: string) => {
    try {
      SoundPlayer.playUrl(`file://${soundUrl}`);
    } catch (error) {
      console.error('Failed to play sound.', error);
    }
  };

  const togglePlayback = useCallback(() => {
    setPlaying(prev => {
      if (prev) {
        SoundPlayer.pause();
        showIcon('pause');
      } else {
        playSound(items[currentIndex].sounds[soundIndex]);
        showIcon('play');
      }
      return !prev;
    });
  }, [currentIndex, items, showIcon, soundIndex]);

  const shuffle = useCallback(() => {
    const indexes = Array.from({length: items.length}, (_, i) => i);
    for (let i = indexes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indexes[i], indexes[j]] = [indexes[j], indexes[i]];
    }
    setShuffleIndexes(indexes);
  }, [items]);

  useEffect(() => {
    if (shuffleMode) {
      shuffle();
    }
  }, [shuffleMode, shuffle]);

  const navigateToItem = useCallback(
    (direction: 'left' | 'right') => {
      const indexes = shuffleMode ? shuffleIndexes : items.map((_, i) => i);
      const current = shuffleMode
        ? shuffleIndexes.indexOf(currentIndex)
        : currentIndex;
      const next = current + (direction === 'right' ? 1 : -1);

      let newIndex = currentIndex;

      if (next >= 0 && next < indexes.length) {
        newIndex = indexes[next];
      } else if (shuffleMode && next >= indexes.length) {
        shuffle();
        newIndex = shuffleIndexes[0];
      } else if (repeatMode === 'always') {
        newIndex = 0;
      }

      if (newIndex !== currentIndex) {
        setCurrentIndex(newIndex);
        setSoundIndex(0);
      }
    },
    [currentIndex, repeatMode, items, shuffle, shuffleIndexes, shuffleMode],
  );

  const toggleViewMode = (mode: 'english' | 'translation') => {
    setViewMode(prev => ({
      ...prev,
      [mode]: !prev[mode],
    }));
  };

  const toggleRepeatMode = () => {
    setRepeatMode(prev =>
      prev === 'none' ? 'once' : prev === 'once' ? 'always' : 'none',
    );
  };

  const toggleShuffleMode = () => {
    setShuffleMode(prev => !prev);
    if (!shuffleMode) {
      shuffle();
    }
  };

  const {saveLastLearned} = useLastLearned();

  useEffect(() => {
    if (type === 'bookmark' || type === 'random') {
      return;
    }

    navigation.addListener('beforeRemove', () => {
      saveLastLearned(
        category,
        items,
        title, // 뒤에 [01] 부분이 있는 경우 제거
        currentIndex,
      );
    });
  }, [category, currentIndex, items, navigation, saveLastLearned, title, type]);

  const {bookmarks = [], toggleBookmark} = useBookmarks(category);

  const isBookmarked = bookmarks.some(
    bookmark =>
      bookmark.num === items[currentIndex].num &&
      bookmark.chapter === items[currentIndex].chapter,
  );

  const handlePress = useClick(
    () => togglePlayback(),
    () => toggleBookmark(items[currentIndex]),
  );

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5;
    },
    onPanResponderRelease: (_, gestureState) => {
      if (Math.abs(gestureState.dx) < 5 && Math.abs(gestureState.dy) < 5) {
        handlePress();
      } else if (gestureState.dy < -50) {
        navigateToItem('right');
      } else if (gestureState.dy > 50) {
        navigateToItem('left');
      }
    },
  });

  useFocusEffect(
    useCallback(() => {
      if (playing) {
        playSound(items[currentIndex].sounds[soundIndex]);
      }
      return () => {
        SoundPlayer.stop();
      };
    }, [currentIndex, playing, items, soundIndex]),
  );

  useEffect(() => {
    const handlePlaybackCompletion = () => {
      const isLastSound = soundIndex === items[currentIndex].sounds.length - 1;
      const isLastItem = currentIndex === items.length - 1;

      if (isLastSound) {
        if (isLastItem) {
          if (repeatMode === 'once') {
            setSoundIndex(0);
          } else if (repeatMode === 'always') {
            items.length === 1 ? setSoundIndex(0) : navigateToItem('right');
          } else {
            togglePlayback();
          }
        } else {
          if (repeatMode === 'once') {
            setSoundIndex(0);
          } else {
            navigateToItem('right');
          }
        }
      } else {
        setSoundIndex(prevSoundIndex => prevSoundIndex + 1);
      }
    };

    const onFinishPlayingSubscription = SoundPlayer.addEventListener(
      'FinishedPlaying',
      ({success}) => {
        if (success && playing) {
          handlePlaybackCompletion();
        }
      },
    );

    return () => {
      onFinishPlayingSubscription.remove();
    };
  }, [
    currentIndex,
    navigateToItem,
    playing,
    repeatMode,
    items,
    soundIndex,
    togglePlayback,
  ]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={{zIndex: 1}} onPress={() => navigation.goBack()}>
          <IIcon name="chevron-back" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.title}>{title}</Text>
        <Pressable onPress={() => toggleBookmark(items[currentIndex])}>
          <IIcon
            name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
            size={24}
            color={isBookmarked ? '#ffd400' : '#fff'}
          />
        </Pressable>
      </View>
      <View style={styles.main} {...panResponder.panHandlers}>
        <Animated.View style={[styles.iconContainer, {opacity: iconOpacity}]}>
          <IIcon name={playing ? 'pause' : 'play'} size={64} color="#fff" />
        </Animated.View>
        <View style={styles.item}>
          {viewMode.english && (
            <Text style={styles.english}>{items[currentIndex].en}</Text>
          )}
        </View>
        <FastImage
          source={typeof imageUri === 'string' ? {uri: imageUri} : imageUri}
          style={styles.image}
          resizeMode={FastImage.resizeMode.contain}
          onError={() => setImageUri(getRandomGif())}
        />
        <View style={styles.item}>
          {viewMode.translation && (
            <Text style={[styles.translation, {marginBottom: 32}]}>
              {items[currentIndex].ko}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.footer}>
        <View style={styles.toggleButtons}>
          <Pressable
            style={[styles.toggleButton, {opacity: viewMode.english ? 1 : 0.3}]}
            onPress={() => toggleViewMode('english')}>
            <Text style={styles.toggleButtonText}>영문</Text>
          </Pressable>
          <Pressable
            style={[
              styles.toggleButton,
              {opacity: viewMode.translation ? 1 : 0.3},
            ]}
            onPress={() => toggleViewMode('translation')}>
            <Text style={styles.toggleButtonText}>뜻</Text>
          </Pressable>
          {type !== 'single' ? (
            <>
              <Pressable
                style={[
                  styles.toggleButton,
                  {opacity: repeatMode === 'none' ? 0.3 : 1},
                ]}
                onPress={toggleRepeatMode}>
                <MIcon
                  name={repeatMode === 'once' ? 'repeat-one' : 'repeat'}
                  size={30}
                  color="#fff"
                />
              </Pressable>
              <Pressable
                style={[styles.toggleButton, {opacity: shuffleMode ? 1 : 0.3}]}
                onPress={toggleShuffleMode}>
                <IIcon name="shuffle" size={30} color="#fff" />
              </Pressable>
            </>
          ) : null}
        </View>
        <Text style={styles.progress}>
          {currentIndex + 1} / {items.length}
        </Text>
      </View>
    </View>
  );
};

export default ContentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 72,
    marginHorizontal: -16,
    paddingHorizontal: 16,
    position: 'relative',
  },
  title: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  main: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  iconContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  image: {
    width: width - 32,
    aspectRatio: 1,
    resizeMode: 'contain',
  },
  item: {
    minHeight: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  english: {
    fontSize: 28,
    fontWeight: '600',
    color: '#ffd400',
  },
  translation: {
    fontSize: 20,
    fontWeight: '500',
    color: '#fff',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 72,
  },
  toggleButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toggleButton: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 8,
  },
  toggleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  progress: {
    color: '#fff',
    fontSize: 16,
    marginRight: 8,
  },
});
