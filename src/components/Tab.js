import React from 'react';
//탭 기능
// import { NavigationContainer } from '@react-navigation/native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {  Home, Main, Number  } from './TabScreen';
//게시글 작성 버튼

const Tab = createBottomTabNavigator();

const TabNavigation = () =>{
return (

  <Tab.Navigator>
      <Tab.Screen name='메인' component={Main} />
      <Tab.Screen name='홈' component={Home} />
      <Tab.Screen name='번호표' component={Number} />
  </Tab.Navigator>


);
};

export default TabNavigation;