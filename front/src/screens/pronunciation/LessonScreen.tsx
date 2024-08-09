import React, {useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  PanResponder,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import SoundPlayer from 'react-native-sound-player';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/Ionicons';
import {DEFAULT_IMAGE_PATHS} from '../../common/constants';

const {width} = Dimensions.get('window');

interface Pronunciation {
  num: number;
  image: string;
  sounds: string[];
  en: string;
  ko: string;
}

const LessonScreen = ({route, navigation}: any) => {
  const {index, pronunciations, title} = route.params as {
    index: number;
    pronunciations: Pronunciation[];
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

  const [imageUri, setImageUri] = useState<string | number>(
    `file://${pronunciations[index].image}`,
  );

  const playSound = (soundUrl: string) => {
    try {
      SoundPlayer.playUrl(`file://${soundUrl}`);
    } catch (error) {
      console.error('Failed to play sound.', error);
    }
  };

  const togglePlayback = () => {
    if (playing) {
      SoundPlayer.pause();
    } else {
      playSound(pronunciations[index].sounds[soundIndex]);
    }
    setPlaying(!playing);
  };

  const toggleViewMode = (mode: 'english' | 'translation') => {
    setViewMode(prev => ({
      ...prev,
      [mode]: !prev[mode],
    }));
  };

  const onMoveLeft = () => {
    if (index > 0) {
      setImageUri(getRandomGif());

      navigation.navigate('PronunciationLesson', {
        index: index - 1,
        pronunciations,
        title,
      });
    }
  };

  const onMoveRight = () => {
    if (index < pronunciations.length - 1) {
      setImageUri(getRandomGif());

      navigation.navigate('PronunciationLesson', {
        index: index + 1,
        pronunciations,
        title,
      });
    }
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => false,
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dy) > 50;
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dy < -50) {
        onMoveRight();
      } else if (gestureState.dy > 50) {
        onMoveLeft();
      }
    },
  });

  useFocusEffect(
    useCallback(() => {
      if (playing) {
        playSound(pronunciations[index].sounds[soundIndex]);
      }
      return () => {
        SoundPlayer.stop();
      };
    }, [index, playing, pronunciations, soundIndex]),
  );

  useEffect(() => {
    const onFinishPlayingSubscription = SoundPlayer.addEventListener(
      'FinishedPlaying',
      ({success}) => {
        if (success && playing) {
          const nextSoundIndex =
            (soundIndex + 1) % pronunciations[index].sounds.length;
          setSoundIndex(nextSoundIndex);
        }
      },
    );
    return () => {
      onFinishPlayingSubscription.remove();
    };
  }, [index, playing, pronunciations, soundIndex]);

  const getRandomGif = () => {
    const randomIndex = Math.floor(Math.random() * DEFAULT_IMAGE_PATHS.length);
    return DEFAULT_IMAGE_PATHS[randomIndex];
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={{zIndex: 1}}
          onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity style={{zIndex: 1}} onPress={togglePlayback}>
          <Icon name={playing ? 'pause' : 'play'} size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.main} {...panResponder.panHandlers}>
        <View style={styles.pronunciation}>
          {viewMode.english && (
            <Text style={styles.english}>{pronunciations[index].en}</Text>
          )}
        </View>
        <FastImage
          source={typeof imageUri === 'string' ? {uri: imageUri} : imageUri}
          style={styles.image}
          resizeMode={FastImage.resizeMode.contain}
          onError={() => setImageUri(getRandomGif())}
        />
        <View style={styles.pronunciation}>
          {viewMode.translation && (
            <Text style={styles.translation}>{pronunciations[index].ko}</Text>
          )}
        </View>
      </View>
      <View style={styles.footer}>
        <View style={styles.toggleButtons}>
          <TouchableOpacity
            style={[styles.toggleButton, {opacity: viewMode.english ? 1 : 0.5}]}
            onPress={() => toggleViewMode('english')}>
            <Text style={styles.toggleButtonText}>영문</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              {opacity: viewMode.translation ? 1 : 0.5},
            ]}
            onPress={() => toggleViewMode('translation')}>
            <Text style={styles.toggleButtonText}>뜻</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.progress}>
          {pronunciations[index].num + 1} / {pronunciations.length}
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
  pronunciation: {
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
    gap: 8,
  },
  toggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#1f6feb',
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
    // fontWeight: '500',
  },
});
