// 홈 - 스택
// StoreTicketStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import StoreList from './StoreList';
import StoreDetail from './StoreDetail';


const Stack = createStackNavigator();

const UserListStack = ({ deviceId }) => (
  
  <Stack.Navigator 
  initialRouteName="StoreList"
  screenOptions={{
    headerBackTitle: "뒤로가기", // 뒤로가기 버튼 텍스트 수정
  }}>
    <Stack.Screen name="StoreList" component={StoreList} options={{ title: '게시글 목록' }} initialParams={ { deviceId } }/>
    <Stack.Screen name="StoreDetail" component={StoreDetail} />
  </Stack.Navigator>
);

export default UserListStack;
