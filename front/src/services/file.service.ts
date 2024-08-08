import storage from '@react-native-firebase/storage';
import RNFS from 'react-native-fs';
import {Alert} from 'react-native';

interface FileInfo {
  path: string;
  url: string;
}

let startTime;

const getFilesFromFirebase = async (
  remotePath: string,
): Promise<FileInfo[]> => {
  const storageRef = storage().ref(remotePath);
  try {
    const result = await storageRef.listAll();
    const filePromises = result.items.map(async item => {
      const url = await item.getDownloadURL();
      return {path: item.fullPath, url};
    });
    return await Promise.all(filePromises);
  } catch (error) {
    console.error('Error listing files from Firebase', error);
    return [];
  }
};

const downloadFile = async (file: FileInfo) => {
  const localFilePath = `${RNFS.DocumentDirectoryPath}/${file.path}`;
  const localDirPath = localFilePath.substring(
    0,
    localFilePath.lastIndexOf('/'),
  );

  try {
    if (!(await RNFS.exists(localDirPath))) {
      await RNFS.mkdir(localDirPath);
    }

    const options = {
      fromUrl: file.url,
      toFile: localFilePath,
    };

    const result = await RNFS.downloadFile(options).promise;
    if (result.statusCode === 200) {
      console.log(`File ${file.path} downloaded to:`, localFilePath);
      return localFilePath;
    } else {
      console.error(`Failed to download file ${file.path}`, result);
      return null;
    }
  } catch (error) {
    console.error(`Error downloading file ${file.path}`, error);
    return null;
  }
};

export const downloadAllFiles = async (paths: string[] | string) => {
  startTime = Date.now();
  try {
    const allFiles: FileInfo[] = [];

    for (const path of paths) {
      const files = await getFilesFromFirebase(path);
      allFiles.push(...files);
    }

    const downloadPromises = allFiles.map(file => downloadFile(file));
    await Promise.all(downloadPromises);

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
  } catch (error) {
    console.error('An error occurred while downloading files', error);
  }
};

export async function checkAndUpdateJSON(category: number, navigation: any) {
  const remoteFilePath = `learning/${category}/${category}.json`;
  console.log(remoteFilePath);
  const remoteDirPath = remoteFilePath.substring(
    0,
    remoteFilePath.lastIndexOf('/'),
  );

  const localFilePath = `${RNFS.DocumentDirectoryPath}/${remoteFilePath}`;
  const localDirPath = `${RNFS.DocumentDirectoryPath}/${remoteDirPath}`;

  try {
    let localVersion: string | null = null;

    if (await RNFS.exists(localFilePath)) {
      const localData = JSON.parse(await RNFS.readFile(localFilePath, 'utf8'));
      localVersion = localData.version;
    }

    const storageRef = storage().ref(remoteFilePath);
    const url = await storageRef.getDownloadURL();
    const remoteData = await fetch(url).then(response => response.json());
    const remoteVersion = remoteData.version;

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
        localFilePath,
        JSON.stringify(remoteData, null, 2),
        'utf8',
      );
      await downloadAllFiles([
        `${remoteDirPath}/images`,
        `${remoteDirPath}/sounds`,
      ]);
      return remoteData.data;
    } else {
      const localData = JSON.parse(await RNFS.readFile(localFilePath, 'utf8'));
      return localData.data;
    }
  } catch (error) {
    console.error('Error handling JSON file: ', error);
  }
}
