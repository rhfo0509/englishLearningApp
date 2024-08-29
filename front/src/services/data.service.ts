import {checkJSONVersion, writeLocalJSON} from './json.service';
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {unzipFile} from './unzip.service';

let startTime: number;

export async function fetchLearningData(
  remoteDirPath: string,
  localDirPath: string,
  category: number,
  updateProgress: (progress: number) => void,
): Promise<boolean> {
  // 최초 학습 데이터 다운로드 시 로컬 디바이스에 default image 저장
  const parentDirPath = localDirPath.slice(0, localDirPath.lastIndexOf('/'));
  let hasFolders = false;
  const items = await RNFS.readDir(parentDirPath);

  hasFolders = items.some(item => item.isDirectory());
  if (!hasFolders) {
    await fetchGeneralData(['assets/data.json']);
  }

  if (!(await RNFS.exists(localDirPath))) {
    await RNFS.mkdir(localDirPath);
  }

  startTime = Date.now();

  await unzipFile(
    `${remoteDirPath}/I_${category}.zip`,
    `${localDirPath}/images.zip`,
    updateProgress,
  );
  await unzipFile(
    `${remoteDirPath}/S_${category}.zip`,
    `${localDirPath}/sounds.zip`,
    updateProgress,
  );

  let elapsedTime = Date.now() - startTime;
  console.log(
    `elapsed time: ${Math.floor(elapsedTime / 1000)}s ${elapsedTime % 1000}ms`,
  );

  return true;
}

export async function fetchGeneralData(remoteJSONPaths: string[]) {
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

        if (remoteJSONPath === 'learning/category.json') {
          await AsyncStorage.setItem(
            'categories',
            JSON.stringify(remoteJson.data),
          );
        } else if (remoteJSONPath === 'learning/chapter.json') {
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
