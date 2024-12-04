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
    }, [])
  ); 
    return (
    <Stack.Navigator 
    initialRouteName="TicketUser"
    screenOptions={{
      headerBackTitle: "뒤로가기", 
      headerTitle: "번호표 관리",
     
    headerTitleStyle: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#333",
      
    },
  
    }}
    >
      <Stack.Screen name="TicketUserStack" component={TicketUserStack} options={{ title: '번호표' }} />
      
      <Stack.Screen name="TicketUser">
        {() => <TicketUser deviceId={deviceId} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};
export default TicketUserStack;