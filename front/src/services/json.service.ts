import storage from '@react-native-firebase/storage';
import RNFS from 'react-native-fs';

export async function readLocalJSON(localJSONPath: string) {
  if (await RNFS.exists(localJSONPath)) {
    const localData = JSON.parse(await RNFS.readFile(localJSONPath, 'utf8'));
    return localData;
  }
  return null;
}

export async function readRemoteJSON(remoteJSONPath: string) {
  const storageRef = storage().ref(remoteJSONPath);
  const url = await storageRef.getDownloadURL();
  const remoteJson = await fetch(url).then(response => response.json());
  return remoteJson;
}

export async function writeLocalJSON(localJSONPath: string, data: any) {
  await RNFS.writeFile(localJSONPath, JSON.stringify(data, null, 2), 'utf8');
}

export async function checkJSONVersion(
  localJSONPath: string,
  remoteJSONPath: string,
) {
  const localJSON = await readLocalJSON(localJSONPath);
  const localVersion = localJSON?.version || null;

  const remoteJson = await readRemoteJSON(remoteJSONPath);
  const remoteVersion = remoteJson.version;

  return {localVersion, remoteVersion, remoteJson};
}
