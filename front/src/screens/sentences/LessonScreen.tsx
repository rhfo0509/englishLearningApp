import React, {useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  PanResponder,
  Pressable,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import SoundPlayer from 'react-native-sound-player';
import FastImage from 'react-native-fast-image';
import Toast from 'react-native-toast-message';
import IIcon from 'react-native-vector-icons/Ionicons';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {DEFAULT_IMAGE_PATHS} from '../../common/constants';
import useClick from '../../hooks/useClick';

const {width} = Dimensions.get('window');

interface Sentence {
  num: number;
  image: string;
  sounds: string[];
  en: string;
  ko: string;
}

const LessonScreen = ({route, navigation}: any) => {
  const {index, sentences, title} = route.params as {
    index: number;
    sentences: Sentence[];
    title: string;
  };

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
    'always',
  );
  const [shuffleMode, setShuffleMode] = useState<boolean>(false);
  const [shuffleIndexes, setShuffleIndexes] = useState<number[]>([]);
  const [imageUri, setImageUri] = useState<string | number>('');

  // 초기 이미지 설정
  const getRandomGif = () => {
    const randomIndex = Math.floor(Math.random() * DEFAULT_IMAGE_PATHS.length);
    return DEFAULT_IMAGE_PATHS[randomIndex];
  };

  useEffect(() => {
    setImageUri(
      sentences[index].image
        ? `file://${sentences[index].image}`
        : getRandomGif(),
    );
  }, [index, sentences]);

  // 사운드 재생 함수
  const playSound = (soundUrl: string) => {
    try {
      SoundPlayer.playUrl(`file://${soundUrl}`);
    } catch (error) {
      console.error('Failed to play sound.', error);
    }
  };

  // 사운드 재생 / 정지
  const togglePlayback = useCallback(() => {
    setPlaying(prev => {
      if (prev) {
        SoundPlayer.pause();
      } else {
        setSoundIndex(0);
        playSound(sentences[index].sounds[0]);
      }
      return !prev;
    });
  }, [index, sentences]);

  // 셔플 목록 생성
  const shuffle = useCallback(() => {
    const indexes = Array.from({length: sentences.length}, (_, i) => i).filter(
      i => i !== index,
    );
    for (let i = indexes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indexes[i], indexes[j]] = [indexes[j], indexes[i]];
    }
    console.log(indexes);
    setShuffleIndexes([index, ...indexes]);
  }, [index, sentences]);

  // 화면 전환 함수
  const navigateToSentence = useCallback(
    (direction: 'left' | 'right') => {
      const currentIndexes = shuffleMode
        ? shuffleIndexes
        : sentences.map((_, i) => i);
      const currentIndex = shuffleMode ? shuffleIndexes.indexOf(index) : index;
      const nextIndex =
        direction === 'right' ? currentIndex + 1 : currentIndex - 1;

      const newIndex =
        nextIndex >= 0 && nextIndex < currentIndexes.length
          ? currentIndexes[nextIndex]
          : repeatMode === 'always'
          ? 0
          : index;

      if (newIndex !== index) {
        navigation.navigate('SentenceLesson', {
          index: newIndex,
          sentences,
          title,
        });
        setSoundIndex(0); // 페이지 이동 시 사운드 인덱스를 초기화
      }
    },
    [
      index,
      navigation,
      repeatMode,
      sentences,
      shuffleIndexes,
      shuffleMode,
      title,
    ],
  );

  // 모드 토글 함수들
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

  const handlePress = useClick(
    togglePlayback, // Single click action
    () => {
      Toast.show({
        type: 'success',
        text1: '북마크 저장됨',
        position: 'bottom',
        visibilityTime: 1500,
      });
    }, // Double click action
  );

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5;
    },
    onPanResponderRelease: (_, gestureState) => {
      if (Math.abs(gestureState.dx) < 5 && Math.abs(gestureState.dy) < 5) {
        // 손가락을 거의 움직이지 않았을 때
        handlePress();
      } else if (gestureState.dy < -50) {
        navigateToSentence('right');
      } else if (gestureState.dy > 50) {
        navigateToSentence('left');
      }
    },
  });

  useFocusEffect(
    useCallback(() => {
      if (playing) {
        playSound(sentences[index].sounds[soundIndex]);
      }
      return () => {
        SoundPlayer.stop();
      };
    }, [index, playing, sentences, soundIndex]),
  );

  // 사운드 재생 완료 시 처리
  useEffect(() => {
    const handlePlaybackCompletion = () => {
      const isLastSound = soundIndex === sentences[index].sounds.length - 1;
      const isLastSentence = index === sentences.length - 1;

      if (isLastSound) {
        if (isLastSentence) {
          if (repeatMode === 'once') {
            setSoundIndex(0); // 같은 문장에서 소리 반복
          } else if (repeatMode === 'always') {
            navigateToSentence('right'); // 처음으로 이동
          } else {
            togglePlayback(); // 'none' 모드인 경우 마지막 문장에서 재생 중지
          }
        } else {
          if (repeatMode === 'once') {
            setSoundIndex(0); // 같은 문장에서 소리 반복
          } else {
            navigateToSentence('right'); // 다음 문장으로 이동
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
    index,
    navigateToSentence,
    playing,
    repeatMode,
    sentences,
    soundIndex,
    togglePlayback,
  ]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={{zIndex: 1}}
          onPress={() => navigation.goBack()}>
          <IIcon name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity style={{zIndex: 1}} onPress={togglePlayback}>
          <IIcon name={playing ? 'pause' : 'play'} size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.main} {...panResponder.panHandlers}>
        <View style={styles.sentence}>
          {viewMode.english && (
            <Text style={styles.english}>{sentences[index].en}</Text>
          )}
        </View>
        <FastImage
          source={typeof imageUri === 'string' ? {uri: imageUri} : imageUri}
          style={styles.image}
          resizeMode={FastImage.resizeMode.contain}
          onError={() => setImageUri(getRandomGif())}
        />
        <View style={styles.sentence}>
          {viewMode.translation && (
            <Text style={styles.translation}>{sentences[index].ko}</Text>
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
        </View>
        <Text style={styles.progress}>
          {sentences[index].num + 1} / {sentences.length}
        </Text>
      </View>
    </View>
  );
};

export default LessonScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#333',
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
  image: {
    width: width - 32,
    aspectRatio: 1,
    resizeMode: 'contain',
  },
  sentence: {
    minHeight: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  english: {
    fontSize: 28,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 32,
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
    paddingHorizontal: 12,
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
  },
});
