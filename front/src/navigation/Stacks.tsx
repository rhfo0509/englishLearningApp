import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';

import SentenceCategoryScreen from '../screens/sentences/CategoryScreen';
import SentenceListScreen from '../screens/sentences/ListScreen';
import SentenceSubListScreen from '../screens/sentences/SubListScreen';
import SentenceLessonScreen from '../screens/sentences/LessonScreen';

import SituationCategoryScreen from '../screens/situation/CategoryScreen';
import SituationListScreen from '../screens/situation/ListScreen';
import SituationSubListScreen from '../screens/situation/SubListScreen';
import SituationLessonScreen from '../screens/situation/LessonScreen';

import WordsCategoryScreen from '../screens/words/CategoryScreen';
import WordsListScreen from '../screens/words/ListScreen';
import WordsSubListScreen from '../screens/words/SubListScreen';
import WordsLessonScreen from '../screens/words/LessonScreen';

import PronunciationCategoryScreen from '../screens/pronunciation/CategoryScreen';
import PronunciationListScreen from '../screens/pronunciation/ListScreen';
import PronunciationSubListScreen from '../screens/pronunciation/SubListScreen';
import PronunciationLessonScreen from '../screens/pronunciation/LessonScreen';

import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();

const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Home"
      component={HomeScreen}
      // options={{headerShown: false}}
    />
  </Stack.Navigator>
);
const ProfileStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Profile"
      component={ProfileScreen}
      options={{headerShown: false}}
    />
  </Stack.Navigator>
);

const SentencesStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="SentenceCategory" component={SentenceCategoryScreen} />
    <Stack.Screen name="SentenceList" component={SentenceListScreen} />
    <Stack.Screen name="SentenceSubList" component={SentenceSubListScreen} />
    <Stack.Screen
      name="SentenceLesson"
      component={SentenceLessonScreen}
      options={{headerShown: false}}
    />
  </Stack.Navigator>
);

const SituationStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="SituationCategory"
      component={SituationCategoryScreen}
    />
    <Stack.Screen name="SituationList" component={SituationListScreen} />
    <Stack.Screen name="SituationSubList" component={SituationSubListScreen} />
    <Stack.Screen
      name="SituationLesson"
      component={SituationLessonScreen}
      options={{headerShown: false}}
    />
  </Stack.Navigator>
);

const PronunciationStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="PronunciationCategory"
      component={PronunciationCategoryScreen}
    />
    <Stack.Screen
      name="PronunciationList"
      component={PronunciationListScreen}
    />
    <Stack.Screen
      name="PronunciationSubList"
      component={PronunciationSubListScreen}
    />
    <Stack.Screen
      name="PronunciationLesson"
      component={PronunciationLessonScreen}
      options={{headerShown: false}}
    />
  </Stack.Navigator>
);

const WordsStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="WordsCategory" component={WordsCategoryScreen} />
    <Stack.Screen name="WordsList" component={WordsListScreen} />
    <Stack.Screen name="WordsSubList" component={WordsSubListScreen} />
    <Stack.Screen
      name="WordsLesson"
      component={WordsLessonScreen}
      options={{headerShown: false}}
    />
  </Stack.Navigator>
);

export {
  HomeStack,
  ProfileStack,
  SentencesStack,
  SituationStack,
  WordsStack,
  PronunciationStack,
};
