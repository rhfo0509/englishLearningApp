import React, {useCallback, useEffect, useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  PanResponder,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import SoundPlayer from 'react-native-sound-player';
import Icon from 'react-native-vector-icons/Ionicons';

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
  const [viewMode, setViewMode] = useState<'뜻' | '영문' | '전체'>('전체');

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
      playSound(sentences[index].sounds[soundIndex]);
    }
    setPlaying(!playing);
  };

  const onMoveLeft = () => {
    if (index > 0) {
      navigation.navigate('SentenceLesson', {
        index: index - 1,
        sentences,
        title,
      });
    }
  };

  const onMoveRight = () => {
    if (index < sentences.length - 1) {
      navigation.navigate('SentenceLesson', {
        index: index + 1,
        sentences,
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
        playSound(sentences[index].sounds[soundIndex]);
      }
      return () => {
        SoundPlayer.stop();
      };
    }, [index, playing, sentences, soundIndex]),
  );

  useEffect(() => {
    const onFinishPlayingSubscription = SoundPlayer.addEventListener(
      'FinishedPlaying',
      ({success}) => {
        if (success && playing) {
          const nextSoundIndex =
            (soundIndex + 1) % sentences[index].sounds.length;
          setSoundIndex(nextSoundIndex);
        }
      },
    );
    return () => {
      onFinishPlayingSubscription.remove();
    };
  }, [index, playing, sentences, soundIndex]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={{zIndex: 1}}
          onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>
          {/* {sentences[index].num + 1} / {sentences.length} */}
          {title}
        </Text>
        <TouchableOpacity style={{zIndex: 1}} onPress={togglePlayback}>
          <Icon name={playing ? 'pause' : 'play'} size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.main} {...panResponder.panHandlers}>
        <View style={styles.sentence}>
          {(viewMode === '영문' || viewMode === '전체') && (
            <Text style={styles.english}>{sentences[index].en}</Text>
          )}
        </View>
        <Image
          source={{uri: `file://${sentences[index].image}`}}
          style={styles.image}
        />
        <View style={styles.sentence}>
          {(viewMode === '뜻' || viewMode === '전체') && (
            <Text style={styles.translation}>{sentences[index].ko}</Text>
          )}
        </View>
      </View>
      <View style={styles.footer}>
        <View style={styles.toggleButtons}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              viewMode === '뜻' && {backgroundColor: '#1d6cb9'},
            ]}
            onPress={() => setViewMode('뜻')}>
            <Text style={styles.toggleButtonText}>뜻</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              viewMode === '영문' && {backgroundColor: '#1d6cb9'},
            ]}
            onPress={() => setViewMode('영문')}>
            <Text style={styles.toggleButtonText}>영문</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              viewMode === '전체' && {backgroundColor: '#1d6cb9'},
            ]}
            onPress={() => setViewMode('전체')}>
            <Text style={styles.toggleButtonText}>전체</Text>
          </TouchableOpacity>
        </View>
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
  image: {
    width: width - 32,
    aspectRatio: 1,
    resizeMode: 'contain',
  },
  main: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  toggleButtons: {
    flexDirection: 'row',
    position: 'absolute',
    top: 16,
    right: 0,
    gap: 8,
  },
  toggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#d3d3d3',
    borderRadius: 8,
  },
  toggleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
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
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 72,
  },
});
