import storage from '@react-native-firebase/storage';
import RNFS from 'react-native-fs';
import {unzip, subscribe} from 'react-native-zip-archive';

export const unzipFile = async (
  remotePath: string,
  localPath: string,
  updateProgress?: (progress: number) => void,
) => {
  try {
    const storageRef = storage().ref(remotePath);

    const url = await storageRef.getDownloadURL();

    await RNFS.downloadFile({
      fromUrl: url,
      toFile: localPath,
      progressInterval: 300, // 진행률 업데이트 간격(바이트)

      progress: res => {
        if (updateProgress) {
          const progress = (res.bytesWritten / res.contentLength) * 80;
          updateProgress(progress); // 다운로드 진행률: 0% ~ 80%
        }
      },
    }).promise;

    console.log(`Downloaded zip file to ${remotePath}`);

    const subscription = subscribe(({progress}) => {
      if (updateProgress) {
        if (localPath.includes('images')) {
          // 압축 해제 파일이 이미지인 경우 80% ~ 90%로 설정
          updateProgress(80 + progress * 10);
        } else if (localPath.includes('sounds')) {
          // 압축 해제 파일이 이미지인 경우 90% ~ 100%로 설정
          updateProgress(90 + progress * 10);
        }
      }
    });

    const unzipPath = await unzip(localPath, localPath.replace(/\.zip$/, ''));
    console.log(`Unzipped to ${unzipPath}`);

    subscription.remove();

    await RNFS.unlink(localPath);
    console.log(`Deleted zip file at ${localPath}`);
  } catch (error: any) {
    if (error.code === 'storage/object-not-found') {
      console.log(
        'The file does not exist in Firebase Storage, skipping download and unzip.',
      );
    } else {
      console.error('Failed to unzip the file:', error);
    }
  }
};
