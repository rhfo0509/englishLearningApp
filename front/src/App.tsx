import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import SplashScreen from 'react-native-splash-screen';
import Root from './navigation/Root';
import {checkAndUpdateJSON} from './services/data.service';

const App = () => {
  useEffect(() => {
    const initialize = async () => {
      try {
        await checkAndUpdateJSON();
      } catch (error) {
        console.error('Error while fetching JSON file', error);
      } finally {
        setTimeout(() => {
          SplashScreen.hide();
        }, 1000);
      }
    };

    initialize();
  }, []);
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer>
        <Root />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;
