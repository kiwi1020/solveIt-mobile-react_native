// 넘버 - 스택
//
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import StoreRegisterEdit from './StoreRegisterEdit';
import StoreRegisterButton from './StoreRegisterButton';
import { useEffect } from 'react';

const Stack = createStackNavigator();

const StoreResisterStack = ({ deviceId })  => (

  <Stack.Navigator 
  initialRouteName="StoreRegisterButton" // 초기 화면 설정
  screenOptions={{
    headerBackTitle: "뒤로가기", // 뒤로가기 버튼 텍스트 수정
  }}
>
  <Stack.Screen
    name="StoreRegisterButton"
    component={StoreRegisterButton}
    options={{ title: '가게 설정' }}
    initialParams={{ deviceId }}
  />
  <Stack.Screen
    name="StoreRegisterEdit"
    component={StoreRegisterEdit}
    options={{ title: '가게 등록 및 수정' }}
  />
</Stack.Navigator>
);

export default StoreResisterStack;