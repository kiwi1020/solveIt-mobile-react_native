import React from 'react';
//탭 기능
// import { NavigationContainer } from '@react-navigation/native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Hint, Home, Figure, Situation, Evidence  } from './TabScreen';
//게시글 작성 버튼
import PostCreationStack from './CreatPostPage/PostCreationStack';

const Tab = createBottomTabNavigator();

const TabNavigation = () =>{
return (

  <Tab.Navigator>
      <Tab.Screen name='Home' component={Home} />
      <Tab.Screen name='Hint' component={Hint} />
      <Tab.Screen name='figure' component={Figure} />
      <Tab.Screen name='evidence' component={Evidence} />
      <Tab.Screen name='Situation' component={Situation} />
      <Tab.Screen name="PostCreation" component={PostCreationStack} options={{ tabBarLabel: '게시글 작성' }} />

  </Tab.Navigator>


);
};

export default TabNavigation;