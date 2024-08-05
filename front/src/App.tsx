import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import Root from './navigation/Root';

const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer>
        <Root />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;
