
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Main from './Main';
import MainLogin from './MainLogin';


const Stack = createStackNavigator();

const MainStack = () => (
  <Stack.Navigator 
  initialRouteName="Main"
  screenOptions={{
    headerBackTitle: "뒤로가기", 
  }}>
    <Stack.Screen name="Main" component={Main} options={{ title: '게시글 목록' }} />
  </Stack.Navigator>
);

export default MainStack;
