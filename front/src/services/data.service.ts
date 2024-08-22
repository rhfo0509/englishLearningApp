import {checkJSONVersion, readLocalJSON, writeLocalJSON} from './json.service';
import {Alert} from 'react-native';
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {unzipFile} from './unzip.service';

let startTime: number;

async function updateLearningData(
  remoteDirPath: string,
  localDirPath: string,
  category: number,
): Promise<boolean> {
  const confirmed = await new Promise<boolean>(resolve => {
    Alert.alert(
      '',
      '학습 데이터를 다운로드하시겠습니까? (통신 요금이 발생할 수 있으므로 Wi-Fi 환경에서 다운로드하는 것을 권장합니다.)',
      [
        {
          text: '아니요',
          style: 'cancel',
          onPress: () => resolve(false),
        },
        {
          text: '네',
          onPress: () => resolve(true),
        },
      ],
      {cancelable: false},
    );
  });

  if (!confirmed) {
    return false;
  }

  if (!(await RNFS.exists(localDirPath))) {
    await RNFS.mkdir(localDirPath);
  }

  startTime = Date.now();

  await unzipFile(
    `${remoteDirPath}/I_${category}.zip`,
    `${localDirPath}/images.zip`,
  );
  await unzipFile(
    `${remoteDirPath}/S_${category}.zip`,
    `${localDirPath}/sounds.zip`,
  );

  let elapsedTime = Date.now() - startTime;
  console.log(
    `elapsed time: ${Math.floor(elapsedTime / 1000)}s ${elapsedTime % 1000}ms`,
  );

  Alert.alert(
    '',
    '모든 데이터가 성공적으로 다운로드되었습니다. 학습을 진행하세요!',
    [{text: "Let's go!"}],
  );

  return true;
}

export async function fetchLearningData(category: number, navigation: any) {
  const remoteJSONPath = `learning/${category}/${category}.json`;
  const remoteDirPath = remoteJSONPath.slice(
    0,
    remoteJSONPath.lastIndexOf('/'),
  );

  const localJSONPath = `${RNFS.DocumentDirectoryPath}/${remoteJSONPath}`;
  const localDirPath = `${RNFS.DocumentDirectoryPath}/${remoteDirPath}`;

  try {
    const {localVersion, remoteVersion, remoteJson} = await checkJSONVersion(
      localJSONPath,
      remoteJSONPath,
    );

    if (localVersion !== remoteVersion) {
      const isSucceeded = await updateLearningData(
        remoteDirPath,
        localDirPath,
        category,
      );

      if (isSucceeded) {
        await writeLocalJSON(localJSONPath, remoteJson);
        return remoteJson.data;
      } else {
        navigation.goBack();
        return null;
      }
    } else {
      const localJSON = await readLocalJSON(localJSONPath);
      return localJSON.data;
    }
  } catch (error) {
    console.error('Error handling learning JSON data update: ', error);
    navigation.goBack();
    return null;
  }
}

export async function fetchGeneralData() {
  const remoteJSONPaths = [
    'data.json',
    'learning/data.json',
    'assets/data.json',
  ];

  for (const remoteJSONPath of remoteJSONPaths) {
    const remoteDirPath = remoteJSONPath.substring(
      0,
      remoteJSONPath.lastIndexOf('/'),
    );
    const localJSONPath = `${RNFS.DocumentDirectoryPath}/${remoteJSONPath}`;
    const localDirPath = `${RNFS.DocumentDirectoryPath}/${remoteDirPath}`;

    try {
      const {localVersion, remoteVersion, remoteJson} = await checkJSONVersion(
        localJSONPath,
        remoteJSONPath,
      );

      if (localVersion !== remoteVersion) {
        if (!(await RNFS.exists(localDirPath))) {
          await RNFS.mkdir(localDirPath);
        }
        await writeLocalJSON(localJSONPath, remoteJson);

        if (remoteJSONPath === 'data.json') {
          await AsyncStorage.setItem(
            'categories',
            JSON.stringify(remoteJson.data),
          );
        } else if (remoteJSONPath === 'learning/data.json') {
          await AsyncStorage.setItem(
            'chapters',
            JSON.stringify(remoteJson.data),
          );
        } else {
          await unzipFile(
            `${remoteDirPath}/lesson.zip`,
            `${localDirPath}/lesson.zip`,
          );
        }
      }
    } catch (error) {
      console.error(
        `Error handling general JSON file at ${remoteJSONPath}:`,
        error,
      );
    }
  }

  return null;
}
