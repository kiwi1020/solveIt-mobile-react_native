// 홈 - 스택
// StoreTicketStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import StoreList from './StoreList';
import StoreDetail from './StoreDetail';


const Stack = createStackNavigator();

const UserListStack = () => (
  <Stack.Navigator initialRouteName="StoreList">
    <Stack.Screen name="StoreList" component={StoreList} options={{ title: '게시글 목록' }} />
    <Stack.Screen name="StoreDetail" component={StoreDetail} options={{ title: '가게 이름' }} />
  </Stack.Navigator>
);

export default UserListStack;
