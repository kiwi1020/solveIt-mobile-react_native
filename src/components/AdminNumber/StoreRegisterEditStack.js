// 넘버 - 스택
//
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import StoreRegisterEdit from './StoreRegisterEdit';



const Stack = createStackNavigator();

const StoreTicketStack = () => (
  <Stack.Navigator 
  initialRouteName="StoreRegisterEdit"
  screenOptions={{
    headerBackTitle: "뒤로가기", // 뒤로가기 버튼 텍스트 수정
  }}
  >
   <Stack.Screen name="StoreRegisterEdit" component={StoreRegisterEdit} options={{ title: '가게 번호 목록' }} />


  </Stack.Navigator>
);

export default StoreTicketStack;