// 홈 - 스택
// StoreTicketStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import StoreList from './StoreList';
import StoreDetail from './StoreDetail';
import { LinearGradient } from 'expo-linear-gradient';


const Stack = createStackNavigator();

const UserListStack = ({ deviceId, expoPushToken }) => (
  
  <Stack.Navigator
    initialRouteName="StoreList"
    screenOptions={{
      headerBackTitle: "뒤로가기",
      headerTintColor: '#000000', 
      
     
    }}
  >
    <Stack.Screen
  name="StoreList"
  component={StoreList}
  options={{
    title: '주점 리스트',
    headerTitleStyle: {
      color: '#000000', 
      fontWeight: 'bold', 
      fontSize: 21, 
    },
    
  }}
  initialParams={{ deviceId, expoPushToken }}
/>
    <Stack.Screen name="StoreDetail" 
    options={{
      headerTitleStyle: {
        color: '#000000',
        fontWeight: 'bold', 
        fontSize: 21, 
      },
      
    }}
    component={StoreDetail} />
  </Stack.Navigator>
);

export default UserListStack;
