import React, {useEffect, useLayoutEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import IIcon from 'react-native-vector-icons/Ionicons';

import Header from '../../components/Header';
import {fetchLearningData} from '../../services/data.service';
import ProgressBar from '../../components/ProgressBar';
import useLearned from '../../hooks/useLearned';
import {checkJSONVersion, writeLocalJSON} from '../../services/json.service';
import Popup from '../../components/Popup';

interface Chapter {
  num: number;
  category: number;
  chapter: number;
  ko: string;
  type: string;
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

interface Item {
  chapter: number;
  num: number;
  image: string;
  sounds: string[];
  en: string;
  ko: string;
}

const ListScreen = ({route, navigation}: any) => {
  const {category, title} = route.params;
  const [popupVisible, setPopupVisible] = useState<boolean>(false);
  const [successPopupVisible, setSuccessPopupVisible] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const {learned, loadLearned} = useLearned();

  const [Json, setJson] = useState<any>(null);
  const remoteJSONPath = `learning/${category}/${category}.json`;
  const remoteDirPath = remoteJSONPath.slice(
    0,
    remoteJSONPath.lastIndexOf('/'),
  );
  const localJSONPath = `${RNFS.DocumentDirectoryPath}/${remoteJSONPath}`;
  const localDirPath = `${RNFS.DocumentDirectoryPath}/${remoteDirPath}`;

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => <Header title={title} />,
    });
  }, [navigation, title]);

  useEffect(() => {
    // 챕터 리스트 로드
    (async () => {
      try {
        const result = await AsyncStorage.getItem('chapters');
        if (result) {
          const parsed: Chapter[] = JSON.parse(result);
          const filtered = parsed.filter(
            chapter => chapter.category === category,
          );
          const sorted = filtered.sort((a, b) => +a.chapter - +b.chapter);
          setChapters(sorted);
        } else {
          setChapters([]);
        }
      } catch (error) {
        console.error('Error while fetching JSON file', error);
      }
    })();
  }, [category]);

  useEffect(() => {
    // 학습 데이터 리스트 로드

    (async () => {
      try {
        const {localVersion, localJSON, remoteVersion, remoteJson} =
          await checkJSONVersion(localJSONPath, remoteJSONPath);

        if (localVersion !== remoteVersion) {
          setJson(remoteJson);
          setPopupVisible(true);
        } else {
          setItems(localJSON.data);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error while checking JSON versions:', error);
        setLoading(false);
      }
    })();
  }, [category, localJSONPath, navigation, remoteJSONPath]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadLearned();
    });

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConfirm = async () => {
    setPopupVisible(false);

    try {
      const isSucceed = await fetchLearningData(
        remoteDirPath,
        localDirPath,
        category,
        setProgress,
      );
      if (isSucceed) {
        await writeLocalJSON(localJSONPath, Json);
        setItems(Json.data);
        setSuccessPopupVisible(true);
      }
    } catch (error) {
      console.error('Error during data update:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({item}: {item: Chapter}) => {
    const allItems = items.filter(i => i.chapter === item.chapter);
    const learnedItemCount = allItems.filter(i =>
      learned[category]?.[i.chapter]?.includes(i.num),
    );

    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() =>
          navigation.navigate('LessonSubList', {
            category,
            chapter: item.chapter,
            title: item.ko,
            items: allItems,
          })
        }>
        <View style={styles.itemContent}>
          <View>
            <Text style={styles.ko}>{item.ko}</Text>
            <Text style={styles.type}>{item.type}</Text>
          </View>
          <Text style={styles.progress}>
            {learnedItemCount.length} / {allItems.length}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loading}>
          <ProgressBar totalStep={100} currStep={progress} />
          <Text>학습 데이터 불러오는 중</Text>
          <Text>잠시만 기다려주세요...</Text>
        </View>
        <Popup
          visible={popupVisible}
          title="알림"
          message="학습 데이터를 다운로드하시겠습니까? (통신 요금이 발생할 수 있으므로 Wi-Fi 환경에서 다운로드하는 것을 권장합니다.)"
          cancelText="No"
          confirmText="Download"
          onCancel={() => {
            setPopupVisible(false);
            navigation.goBack();
          }}
          onConfirm={handleConfirm}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate('LessonContent', {
              category,
              items,
              title,
              index: 0,
              type: 'normal',
            })
          }>
          <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            colors={['#56ab2f', '#a8e063']}
            style={styles.gradient}>
            <Text style={styles.buttonText}>Play All</Text>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
              <IIcon name="play-circle-outline" size={24} color="#fff" />
              <Text style={{color: '#fff'}}>Play Now</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Bookmark', {category, title})}>
          <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            colors={['#1f6feb', '#53c1ff']}
            style={styles.gradient}>
            <Text style={styles.buttonText}>Bookmark</Text>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
              <IIcon name="bookmark-outline" size={24} color="#fff" />
              <Text style={{color: '#fff'}}>Play Now</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      <FlatList
        style={{marginTop: 8}}
        data={chapters}
        renderItem={renderItem}
        keyExtractor={item => item.num.toString()}
        showsVerticalScrollIndicator={false}
      />
      <Popup
        visible={successPopupVisible}
        title="알림"
        message="모든 데이터가 성공적으로 다운로드되었습니다. 학습을 진행하세요!"
        confirmText="Let's Go!"
        onConfirm={() => {
          setSuccessPopupVisible(false);
        }}
      />
    </View>
  );
};

export default ListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eeeff3',
    paddingHorizontal: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  button: {
    flex: 1,
    height: 80,
    borderRadius: 20,
    marginHorizontal: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    marginLeft: 4,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    borderRadius: 20,
    paddingLeft: 20,
    gap: 8,
  },
  item: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
  },
  itemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ko: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  type: {
    color: '#666',
    marginTop: 4,
  },
  progress: {
    color: '#1f6feb',
    fontWeight: '500',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
