// 넘버 - 스택
//
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import StoreRegisterEdit from './StoreRegisterEdit';
import StoreRegisterButton from './StoreRegisterButton';
import TicketUser from './TicketUser';



const Stack = createStackNavigator();

const StoreTicketStack = () => (
  <Stack.Navigator 
  initialRouteName="TicketUser"
  screenOptions={{
    headerBackTitle: "뒤로가기", // 뒤로가기 버튼 텍스트 수정
  }}
  >
    <Stack.Screen name="StoreTicketStack" component={StoreTicketStack} options={{ title: '게시글 목록' }} />
    {/* <Stack.Screen name="StoreRegisterEdit" component={StoreRegisterEdit} options={{ title: '가게 등록 수정' }} /> */}
    {/* <Stack.Screen name="StoreRegisterButton" component={StoreRegisterButton} options={{ title: '가게등록 버튼' }} /> */}
    <Stack.Screen name="TicketUser" component={TicketUser} options={{ title: '가게 번호 목록' }} />


  </Stack.Navigator>
);

export default StoreTicketStack;