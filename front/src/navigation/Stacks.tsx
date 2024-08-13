import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';

import LessonCategoryScreen from '../screens/lesson/CategoryScreen';
import LessonListScreen from '../screens/lesson/ListScreen';
import LessonSubListScreen from '../screens/lesson/SubListScreen';
import LessonContentScreen from '../screens/lesson/ContentScreen';
import BookmarkScreen from '../screens/lesson/BookmarkScreen';

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

const LessonStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="LessonCategory" component={LessonCategoryScreen} />
    <Stack.Screen name="LessonList" component={LessonListScreen} />
    <Stack.Screen name="LessonSubList" component={LessonSubListScreen} />
    <Stack.Screen
      name="LessonContent"
      component={LessonContentScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen name="Bookmark" component={BookmarkScreen} />
  </Stack.Navigator>
);

export {HomeStack, ProfileStack, LessonStack};
