import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import SplashScreen from 'react-native-splash-screen';
import TrackPlayer from 'react-native-track-player';
import Toast from 'react-native-toast-message';
import Root from './navigation/Root';
import toastConfig from './components/Toast';
import {UserProvider} from './contexts/UserContext';
import {SettingsProvider} from './contexts/SettingsContext';
import {fetchGeneralData} from './services/data.service';

const App = () => {
  useEffect(() => {
    (async () => {
      try {
        await fetchGeneralData([
          'learning/category.json',
          'learning/chapter.json',
        ]);
        await TrackPlayer.setupPlayer();
      } catch (error) {
        console.error('Failed to fetch general data', error);
      } finally {
        SplashScreen.hide();
      }
    })();
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <UserProvider>
        <SettingsProvider>
          <NavigationContainer>
            <Root />
          </NavigationContainer>
          <Toast config={toastConfig} />
        </SettingsProvider>
      </UserProvider>
    </GestureHandlerRootView>
  );
};

export default App;
