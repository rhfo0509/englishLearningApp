/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import TrackPlayer from 'react-native-track-player';

AppRegistry.registerComponent(appName, () => App);

// background service (필요하지 않더라도 추가 필수)
TrackPlayer.registerPlaybackService(() =>
  require('./src/services/sound.service'),
);
