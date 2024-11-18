
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Main from './Main';
import StoreDetail from './Home/StoreDetail';
import StoreList from './Home/StoreList';


const Stack = createStackNavigator();

const MainStack = () => (
  <Stack.Navigator 
  initialRouteName="Main"
  screenOptions={{
    headerBackTitle: "뒤로가기", // 뒤로가기 버튼 텍스트 수정
  }}>
    <Stack.Screen name="Main" component={Main} options={{ title: '게시글 목록' }} />
    <Stack.Screen name="StoreList" component={StoreList} options={{title : "가게 목록"}}/>
    <Stack.Screen name="StoreDetail" component={StoreDetail} options={{ title: '가게 이름' }} />
  </Stack.Navigator>
);

export default MainStack;
