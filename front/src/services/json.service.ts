import storage from '@react-native-firebase/storage';
import RNFS from 'react-native-fs';
import {Alert} from 'react-native';
import {unzipFile} from './unzip.service';

let startTime;

export async function checkAndUpdateJSON(category: number, navigation: any) {
  const remoteJSONPath = `learning/${category}/${category}.json`;
  const remoteDirPath = remoteJSONPath.slice(
    0,
    remoteJSONPath.lastIndexOf('/'),
  );

  const localJSONPath = `${RNFS.DocumentDirectoryPath}/${remoteJSONPath}`;
  const localDirPath = `${RNFS.DocumentDirectoryPath}/${remoteDirPath}`;

  try {
    let localVersion: string | null = null;

    if (await RNFS.exists(localJSONPath)) {
      const localData = JSON.parse(await RNFS.readFile(localJSONPath, 'utf8'));
      localVersion = localData.version;
    }

    const storageRef = storage().ref(remoteJSONPath);
    const url = await storageRef.getDownloadURL();
    const remoteJson = await fetch(url).then(response => response.json());
    const remoteVersion = remoteJson.version;

    if (localVersion !== remoteVersion) {
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

      // '아니오'를 누르는 경우
      if (!confirmed) {
        navigation.goBack();
        return;
      }

      // '예'를 누르는 경우
      if (!(await RNFS.exists(localDirPath))) {
        await RNFS.mkdir(localDirPath);
      }
      await RNFS.writeFile(
        localJSONPath,
        JSON.stringify(remoteJson, null, 2),
        'utf8',
      );

      startTime = Date.now();

      await unzipFile(
        `${remoteDirPath}/images.zip`,
        `${localDirPath}/images.zip`,
      );
      await unzipFile(
        `${remoteDirPath}/sounds.zip`,
        `${localDirPath}/sounds.zip`,
      );

      let elapsedTime = Date.now() - startTime;
      console.log(
        `elapsed time: ${Math.floor(elapsedTime / 1000)}s ${
          elapsedTime % 1000
        }ms`,
      );

      Alert.alert(
        '',
        '모든 데이터가 성공적으로 다운로드되었습니다. 학습을 진행하세요!',
        [{text: "Let's go!"}],
      );

      return remoteJson.data;
    } else {
      const localData = JSON.parse(await RNFS.readFile(localJSONPath, 'utf8'));
      return localData.data;
    }
  } catch (error) {
    console.error('Error handling file: ', error);
  }
}
