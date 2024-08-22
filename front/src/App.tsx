import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import SplashScreen from 'react-native-splash-screen';
import Toast from 'react-native-toast-message';
import Root from './navigation/Root';
import toastConfig from './components/Toast';
import {UserProvider} from './contexts/UserContext';
import {SettingsProvider} from './contexts/SettingsContext';

const App = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      SplashScreen.hide();
    }, 500);
    return () => clearTimeout(timer);
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
