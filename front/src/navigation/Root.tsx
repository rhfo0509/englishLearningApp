import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {
  HomeStack,
  ProfileStack,
  PronunciationStack,
  SentencesStack,
  SituationStack,
  WordsStack,
} from '../navigation/Stacks';

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
        name="SentencesStack"
        component={SentencesStack}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SituationStack"
        component={SituationStack}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="WordsStack"
        component={WordsStack}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PronunciationStack"
        component={PronunciationStack}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default Root;
