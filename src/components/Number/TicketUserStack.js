// 넘버 - 스택

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import TicketUser from './TicketUser';



const Stack = createStackNavigator();

const TicketUserStack = ({ deviceId }) => (
  <Stack.Navigator 
  initialRouteName="TicketUser"
  screenOptions={{
    headerBackTitle: "뒤로가기", // 뒤로가기 버튼 텍스트 수정
  }}
  >
    <Stack.Screen name="TicketUserStack" component={TicketUserStack} options={{ title: '게시글 목록' }} />
    
    <Stack.Screen name="TicketUser">
      {() => <TicketUser deviceId={deviceId} />}
    </Stack.Screen>


  </Stack.Navigator>
);

export default TicketUserStack;