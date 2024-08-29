import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  PanResponder,
  Pressable,
  Animated,
  ActivityIndicator,
} from 'react-native';
import RNFS from 'react-native-fs';
import TrackPlayer, {
  Event,
  State,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import FastImage from 'react-native-fast-image';
import IIcon from 'react-native-vector-icons/Ionicons';
import MIcon from 'react-native-vector-icons/MaterialIcons';

import {DEFAULT_IMAGE_PATHS} from '../../common/constants';
import useClick from '../../hooks/useClick';
import useBookmarks from '../../hooks/useBookmarks';
import useLastLearned from '../../hooks/useLastLearned';
import useLearned from '../../hooks/useLearned';
import {useSettings} from '../../contexts/SettingsContext';

const {width} = Dimensions.get('window');

interface Item {
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
    chapter,
    items,
    title,
    index = Math.floor(Math.random() * items.length),
    type,
  } = route.params as {
    category: number;
    chapter: number;
    items: Item[];
    title: string;
    index: number;
    type: string;
  };

  const {saveLearned} = useLearned();
  const [loading, setLoading] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState<number>(index);
  const {settings, setSettings} = useSettings();

  const [viewMode, setViewMode] = useState<{
    english: boolean;
    translation: boolean;
  }>({
    english: true,
    translation: true,
  });
  const [repeatMode, setRepeatMode] = useState<'always' | 'once' | 'none'>(
    type === 'single' ? 'once' : settings.repeatMode,
  );
  const [shuffleMode, setShuffleMode] = useState<boolean>(settings.shuffleMode);
  const [shuffleIndexes, setShuffleIndexes] = useState<number[]>([]);

  // image
  const [imageUri, setImageUri] = useState<string>('');
  const [defaultImageCount, setDefaultImageCount] = useState<number>(0);
  const prevImageIndexRef = useRef<number | null>(null);

  useEffect(() => {
    RNFS.readDir(DEFAULT_IMAGE_PATHS)
      .then(images => {
        setDefaultImageCount(images.length);
      })
      .catch(error => {
        console.error('Failed to fetch default images: ', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const getRandomGif = useCallback(() => {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * defaultImageCount);
    } while (randomIndex === prevImageIndexRef.current);

    prevImageIndexRef.current = randomIndex; // 선택된 인덱스를 저장

    return `file://${DEFAULT_IMAGE_PATHS}/${randomIndex}.gif`;
  }, [defaultImageCount]);

  useEffect(() => {
    setImageUri(
      items[currentIndex].image
        ? `file://${items[currentIndex].image}`
        : getRandomGif(),
    );
  }, [currentIndex, getRandomGif, items]);

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

  // sound with TrackPlayer
  const [voiceSpeed, setVoiceSpeed] = useState<number>(settings.voiceSpeed);
  const [playing, setPlaying] = useState<boolean>(true);

  // TrackPlayer 초기화 (최초 1번)
  useEffect(() => {
    (async () => {
      try {
        await TrackPlayer.reset();
        await TrackPlayer.setRate(voiceSpeed / 10);

        const initialSounds = items[currentIndex].sounds;

        for (let i = 0; i < initialSounds.length; i++) {
          await TrackPlayer.add({
            id: `${currentIndex}-${i}`,
            url: `file://${initialSounds[i]}`,
            title: items[currentIndex].en,
            artist: 'me',
          });
        }

        saveLearned(category, items[currentIndex].chapter, currentIndex);
        await TrackPlayer.play();
      } catch (error) {
        console.error('Error while initializing TrackPlayer: ', error);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 화면 벗어나는 경우 settings 저장 및 TrackPlayer reset
  useEffect(() => {
    const listener = navigation.addListener('beforeRemove', async () => {
      if (type !== 'single') {
        setSettings({...settings, repeatMode, shuffleMode});
      }
      await TrackPlayer.reset();
    });
    return () => navigation.removeListener('beforeRemove', listener);
  }, [navigation, repeatMode, setSettings, settings, shuffleMode, type]);

  // play and pause
  const togglePlayback = useCallback(async () => {
    const {state} = await TrackPlayer.getPlaybackState();

    if (state === State.Playing) {
      await TrackPlayer.pause();
      setPlaying(false);
      showIcon('pause');
    } else if (state === State.Paused || state === State.Ready) {
      await TrackPlayer.play();
      setPlaying(true);
      showIcon('play');
    }
  }, [showIcon, setPlaying]);

  // 다음 학습 데이터에 해당하는 사운드 파일들을 재생
  const playNextTrack = useCallback(
    async (index: number) => {
      await TrackPlayer.reset();
      setCurrentIndex(index);

      const nextSounds = items[index].sounds;
      for (let i = 0; i < nextSounds.length; i++) {
        await TrackPlayer.add({
          id: `${index}-${i}`,
          url: `file://${nextSounds[i]}`,
          title: items[index].en,
        });
      }

      saveLearned(category, chapter, index);
      await TrackPlayer.play();
    },
    [category, chapter, items, saveLearned],
  );

  // playback queue ended
  useTrackPlayerEvents([Event.PlaybackQueueEnded], async () => {
    let nextIndex;

    if (shuffleMode) {
      const currentShuffleIndex = shuffleIndexes.indexOf(currentIndex);
      nextIndex =
        repeatMode === 'once' ? currentShuffleIndex : currentShuffleIndex + 1;

      if (nextIndex >= items.length) {
        // 셔플 인덱스의 끝에 도달하면 새로운 셔플 생성
        shuffle();
        nextIndex = shuffleIndexes[0];
      } else {
        nextIndex = shuffleIndexes[nextIndex];
      }
    } else {
      nextIndex = repeatMode === 'once' ? currentIndex : currentIndex + 1;
      if (nextIndex >= items.length) {
        if (repeatMode === 'always') {
          nextIndex = 0;
        } else {
          await TrackPlayer.reset();
          return;
        }
      }
    }

    await playNextTrack(nextIndex);
  });

  // 셔플 함수
  const shuffle = useCallback(() => {
    const indexes = Array.from({length: items.length}, (_, i) => i);
    for (let i = indexes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indexes[i], indexes[j]] = [indexes[j], indexes[i]];
    }
    setShuffleIndexes(indexes);
  }, [items]);

  // 셔플 모드 전환 시 셔플 함수 실행
  useEffect(() => {
    if (shuffleMode) {
      shuffle();
    }
  }, [shuffleMode, shuffle]);

  // 직접 화면을 위아래로 스와이프하는 경우
  const handleScroll = useCallback(
    async (direction: 'left' | 'right') => {
      let nextIndex;

      if (shuffleMode) {
        const currentShuffleIndex = shuffleIndexes.indexOf(currentIndex);
        nextIndex = currentShuffleIndex + (direction === 'right' ? 1 : -1);

        if (nextIndex < 0 || nextIndex >= items.length) {
          shuffle();
          nextIndex = shuffleIndexes[0];
        } else {
          nextIndex = shuffleIndexes[nextIndex];
        }
      } else {
        const next = currentIndex + (direction === 'right' ? 1 : -1);
        if (next >= 0 && next < items.length) {
          nextIndex = next;
        } else if (repeatMode === 'always') {
          nextIndex = 0;
        } else {
          return;
        }
      }

      await playNextTrack(nextIndex);
    },
    [
      currentIndex,
      repeatMode,
      items,
      shuffle,
      shuffleIndexes,
      shuffleMode,
      playNextTrack,
    ],
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
        handleScroll('right');
      } else if (gestureState.dy > 50) {
        handleScroll('left');
      }
    },
  });

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

  const toggleVoiceSpeed = async () => {
    const newVoiceSpeed = voiceSpeed === 6 ? 8 : voiceSpeed === 8 ? 10 : 6;
    setVoiceSpeed(newVoiceSpeed);
    await TrackPlayer.setRate(newVoiceSpeed / 10);
  };

  const {saveLastLearned} = useLastLearned();

  useEffect(() => {
    if (type === 'bookmark' || type === 'random') {
      return;
    }

    const listener = navigation.addListener('beforeRemove', () => {
      saveLastLearned(category, chapter, items, title, currentIndex);
    });

    return () => navigation.removeListener('beforeRemove', listener);
  }, [
    category,
    chapter,
    currentIndex,
    items,
    navigation,
    saveLastLearned,
    title,
    type,
  ]);

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
          <IIcon name={playing ? 'play' : 'pause'} size={64} color="#fff" />
        </Animated.View>
        <View style={[styles.item, {justifyContent: 'flex-end'}]}>
          {viewMode.english && (
            <Text style={styles.english}>{items[currentIndex].en}</Text>
          )}
        </View>
        <FastImage
          source={{uri: imageUri}}
          style={styles.image}
          resizeMode={FastImage.resizeMode.contain}
          onError={() => setImageUri(getRandomGif())}
        />
        <View style={[styles.item, {justifyContent: 'flex-start'}]}>
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
          <Pressable
            style={[styles.toggleButton]}
            onPress={() => toggleVoiceSpeed()}>
            <Text style={styles.toggleButtonText}>{voiceSpeed / 10}x</Text>
          </Pressable>
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
    fontSize: 32,
    fontWeight: '600',
    color: '#18ffff',
  },
  translation: {
    fontSize: 24,
    fontWeight: '500',
    color: '#ffd400',
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
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
