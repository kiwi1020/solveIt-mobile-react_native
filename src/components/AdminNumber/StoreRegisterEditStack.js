import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import StoreRegisterEdit from './StoreRegisterEdit';
import StoreRegisterButton from './StoreRegisterButton';
import { useEffect } from 'react';

const Stack = createStackNavigator();

//가게 설정 파트 스택 네비게이터
const StoreResisterStack = ({ deviceId })  => (

  <Stack.Navigator 
  initialRouteName="StoreRegisterButton" 
  screenOptions={{
    headerBackTitle: "뒤로가기", 
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