import React from 'react';
//탭 기능
// import { NavigationContainer } from '@react-navigation/native';
import UserListStack from "./Home/UserListStack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {    Number  } from './TabScreen';
import Icon from "react-native-vector-icons/Ionicons"; // 아이콘 라이브러리 import
import MainStack from "./MainStack";
//게시글 작성 버튼

const Tab = createBottomTabNavigator();

const TabNavigation = () =>{
return (

  <Tab.Navigator 
  screenOptions={({ route }) => ({
    tabBarIcon: ({ focused, color, size }) => {
      let iconName;

      // 라우트 이름에 따라 아이콘 선택
      if (route.name === "메인") {
        iconName = focused ? "list" : "list";
      } else if (route.name === "홈") {
        iconName = focused ? "home" : "home-outline";
      } else if (route.name === "번호표") {
        iconName = focused ? "receipt" : "receipt-outline";
      }

      // 아이콘 렌더링
      return <Icon name={iconName} size={size} color={color} />;
    },
    headerShown: false, // 모든 탭의 상단 헤더 숨김
    tabBarActiveTintColor: "#6661D5", // 활성화된 탭 색상
    tabBarInactiveTintColor: "gray", // 비활성화된 탭 색상
  })}
  >
      <Tab.Screen name='메인' component={MainStack} />
      <Tab.Screen name='홈' component={UserListStack} /> 
      <Tab.Screen name='번호표' component={Number} />
  </Tab.Navigator>


);
};

export default TabNavigation;