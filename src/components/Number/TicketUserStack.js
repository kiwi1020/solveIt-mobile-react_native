// 넘버 - 스택

import React, { useCallback } from "react";
import { createStackNavigator } from '@react-navigation/stack';
import TicketUser from './TicketUser';



const Stack = createStackNavigator();


const TicketUserStack = ({ deviceId }) => {
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
      <Stack.Screen name="TicketUser">
        {() => <TicketUser deviceId={deviceId} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};
export default TicketUserStack;