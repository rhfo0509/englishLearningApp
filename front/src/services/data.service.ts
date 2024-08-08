import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from '@react-native-firebase/storage';
import RNFS from 'react-native-fs';

const getJSONFromFirebase = async (path: string) => {
  try {
    const storageRef = storage().ref(path);
    const url = await storageRef.getDownloadURL();
    const response = await fetch(url);
    const json = await response.json();

    return json;
  } catch (error) {
    console.error('Error getting JSON file from Firebase', error);
    return [];
  }
};

export async function checkAndUpdateJSON() {
  const remoteJSONPaths = ['data.json', 'learning/data.json'];
  const data = {category: null, chapter: null};

  for (const remoteJSONPath of remoteJSONPaths) {
    const remoteDirPath = remoteJSONPath.substring(
      0,
      remoteJSONPath.lastIndexOf('/'),
    );

    const localJSONPath = `${RNFS.DocumentDirectoryPath}/${remoteJSONPath}`;
    const localDirPath = `${RNFS.DocumentDirectoryPath}/${remoteDirPath}`;

    try {
      let localVersion: string | null = null;

      if (await RNFS.exists(localJSONPath)) {
        const localJSON = JSON.parse(
          await RNFS.readFile(localJSONPath, 'utf8'),
        );
        localVersion = localJSON.version;
      }

      const remoteJSON = await getJSONFromFirebase(remoteJSONPath);
      if (!remoteJSON) {
        throw new Error(`Failed to fetch remote data from ${remoteJSONPath}`);
      }

      const remoteVersion = remoteJSON.version;

      if (localVersion !== remoteVersion) {
        if (!(await RNFS.exists(localDirPath))) {
          await RNFS.mkdir(localDirPath);
        }
        await RNFS.writeFile(
          localJSONPath,
          JSON.stringify(remoteJSON, null, 2),
          'utf8',
        );
        remoteJSONPath === 'data.json'
          ? await AsyncStorage.setItem(
              'categories',
              JSON.stringify(remoteJSON.data),
            )
          : await AsyncStorage.setItem(
              'chapters',
              JSON.stringify(remoteJSON.data),
            );
      }
    } catch (error) {
      console.error(`Error handling JSON file at ${remoteJSONPath}:`, error);
    }
  }

  return data;
}
