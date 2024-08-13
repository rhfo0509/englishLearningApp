import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {HomeStack, ProfileStack, LessonStack} from '../navigation/Stacks';

const Stack = createNativeStackNavigator();

const Root = () => {
  return (
    <Stack.Navigator>
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
    </Stack.Navigator>
  );
};

export default Root;
