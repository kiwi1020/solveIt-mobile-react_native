// 넘버 - 스택
//
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import StoreTicketList from './StoreTicketList';



const Stack = createStackNavigator();

const StoreTicketStack = ({ deviceId }) => (
  <Stack.Navigator 
  initialRouteName="StoreTicketList"
  screenOptions={{
    headerBackTitle: "뒤로가기", // 뒤로가기 버튼 텍스트 수정
  }}
  >
    <Stack.Screen name="StoreTicketStack" component={StoreTicketStack} options={{ title: '게시글 목록' }} />
    {() => <StoreTicketList deviceId={deviceId} />}<Stack.Screen 
      name="StoreTicketList" 
      options={{ title: "가게 번호표 목록" }}
    >
      {() => <StoreTicketList deviceId={deviceId} />}
    </Stack.Screen>

  </Stack.Navigator>
);

export default StoreTicketStack;