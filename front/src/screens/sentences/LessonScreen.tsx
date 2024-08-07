import {
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import SoundPlayer from 'react-native-sound-player';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

const {width} = Dimensions.get('window');
interface Sentence {
  num: number;
  image: string;
  sounds: string[];
  en: string;
  ko: string;
}

const LessonScreen = ({route, navigation}) => {
  const {index, sentences} = route.params as {
    index: number;
    sentences: Sentence[];
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

  const onMoveLeft = () => {
    if (index > 0) {
      navigation.navigate('SentenceLesson', {
        index: index - 1,
        sentences,
      });
    }
  };

  const onMoveRight = () => {
    if (index < sentences.length - 1) {
      navigation.navigate('SentenceLesson', {
        index: index + 1,
        sentences,
      });
    }
  };

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
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        colors={['#1d6cb9', '#53c1ff']}
        style={styles.header}>
        <TouchableOpacity
          style={{zIndex: 1}}
          onPress={() => navigation.goBack()}>
          <Icon name="close-outline" size={36} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.progress}>
          {sentences[index].num + 1} / {sentences.length}
        </Text>
      </LinearGradient>
      <View style={styles.main}>
        <View style={styles.toggleButtons}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              viewMode === '뜻' && {backgroundColor: '#b0c4de'},
            ]}
            onPress={() => setViewMode('뜻')}>
            <Text style={styles.toggleButtonText}>뜻</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              viewMode === '영문' && {backgroundColor: '#b0c4de'},
            ]}
            onPress={() => setViewMode('영문')}>
            <Text style={styles.toggleButtonText}>영문</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              viewMode === '전체' && {backgroundColor: '#b0c4de'},
            ]}
            onPress={() => setViewMode('전체')}>
            <Text style={styles.toggleButtonText}>전체</Text>
          </TouchableOpacity>
        </View>
        <Image
          source={{uri: `file://${sentences[index].image}`}}
          style={styles.image}
        />
        <View style={styles.sentence}>
          {(viewMode === '영문' || viewMode === '전체') && (
            <Text style={styles.english}>{sentences[index].en}</Text>
          )}
          {(viewMode === '뜻' || viewMode === '전체') && (
            <Text style={styles.translation}>{sentences[index].ko}</Text>
          )}
        </View>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.moveButton} onPress={onMoveLeft}>
          <Icon name="play-back-circle-outline" size={48} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.playButton}
          onPress={() => setPlaying(prev => !prev)}>
          <Icon
            name={playing ? 'pause-circle-outline' : 'play-circle-outline'}
            size={48}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.moveButton} onPress={onMoveRight}>
          <Icon name="play-forward-circle-outline" size={48} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LessonScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 72,
    marginHorizontal: -16,
    paddingHorizontal: 16,
    position: 'relative',
  },
  progress: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#fff',
    fontSize: 24,
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
    // borderWidth: 2,
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
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 32,
  },
  translation: {
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 72,
  },
  moveButton: {
    padding: 10,
  },
  playButton: {
    padding: 10,
  },
});
