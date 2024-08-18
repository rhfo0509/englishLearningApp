import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {
  HomeStack,
  ProfileStack,
  LessonStack,
  AuthStack,
} from '../navigation/Stacks';
import {useUser} from '../contexts/UserContext';

const Stack = createNativeStackNavigator();

const Root = () => {
  const {user} = useUser();

  return (
    <Stack.Navigator>
      {user ? (
        <>
          <Stack.Screen
            name="HomeStack"
            component={HomeStack}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ProfileStack"
            component={ProfileStack}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="LessonStack"
            component={LessonStack}
            options={{headerShown: false}}
          />
        </>
      ) : (
        <Stack.Screen
          name="AuthStack"
          component={AuthStack}
          options={{headerShown: false}}
        />
      )}
    </Stack.Navigator>
  );
};

export default Root;
