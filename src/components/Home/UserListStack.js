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
      headerTintColor: '#ffffff', // 뒤로가기 버튼 색상 (예: 주황색)
      headerStyle: {
        height: 75, // 헤더 높이
      },
      headerBackground: () => (
        <LinearGradient
          colors={['#BFC0D6', '#CBBCD8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1 }}
        />
      ),
    }}
  >
    <Stack.Screen
  name="StoreList"
  component={StoreList}
  options={{
    title: '가게 목록',
    headerTitleStyle: {
      color: '#ffffff', // 글자 색상 (예: 흰색)
      fontWeight: 'bold', // 글자 굵기 (예: 굵게)
      fontSize: 21, // 글자 크기 (선택 사항)
    },
  }}
  initialParams={{ deviceId, expoPushToken }}
/>
    <Stack.Screen name="StoreDetail" 
    options={{
    title: '',
  }}
    component={StoreDetail} />
  </Stack.Navigator>
);

export default UserListStack;
