import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import SplashScreen from 'react-native-splash-screen';
import {DataContextProvider} from './contexts/DataContext';
import Root from './navigation/Root';

const App = () => {
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 1000);
  }, []);
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer>
        <DataContextProvider>
          <Root />
        </DataContextProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;
