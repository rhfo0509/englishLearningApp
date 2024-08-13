import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import SplashScreen from 'react-native-splash-screen';
import Toast from 'react-native-toast-message';
import Root from './navigation/Root';
import {checkAndUpdateJSON} from './services/data.service';
import toastConfig from './components/Toast';

const App = () => {
  useEffect(() => {
    const initialize = async () => {
      try {
        await checkAndUpdateJSON();
      } catch (error) {
        console.error('Error while fetching JSON file', error);
      } finally {
        SplashScreen.hide();
      }
    };

    initialize();
  }, []);
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer>
        <Root />
      </NavigationContainer>
      <Toast config={toastConfig} />
    </GestureHandlerRootView>
  );
};

export default App;
