// 넘버 - 스택

import React, { useCallback } from "react";
import { createStackNavigator } from '@react-navigation/stack';
import { useFocusEffect } from "@react-navigation/native";
import TicketUser from './TicketUser';



const Stack = createStackNavigator();

const TicketUserStack = ({ deviceId }) => {
  useFocusEffect(
    useCallback(() => {
      console.log("TicketUserStack 활성화됨! 데이터를 새로고침합니다.");
      // 스택 활성화 시 필요한 동작을 실행 (예: 로그 기록)
    }, [])
  );
    return (
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
};
export default TicketUserStack;