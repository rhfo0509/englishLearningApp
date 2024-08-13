import storage from '@react-native-firebase/storage';
import RNFS from 'react-native-fs';
import {unzip} from 'react-native-zip-archive';

export const unzipFile = async (remotePath: string, localPath: string) => {
  try {
    const storageRef = storage().ref(remotePath);
    const url = await storageRef.getDownloadURL();

    const options = {
      fromUrl: url,
      toFile: localPath,
    };

    await RNFS.downloadFile(options).promise;

    const unzipPath = await unzip(localPath, localPath.replace(/\.zip$/, ''));
    console.log(`Unzipped to ${unzipPath}`);

    await RNFS.unlink(localPath);
    console.log(`Deleted zip file at ${localPath}`);
  } catch (error) {
    console.error('Failed to unzip the file: ', error);
  }
};
