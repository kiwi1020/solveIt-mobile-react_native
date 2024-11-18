
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Main from './Main';
import MainLogin from './MainLogin';


const Stack = createStackNavigator();

const MainStack = () => (
  <Stack.Navigator 
  initialRouteName="Main"
  screenOptions={{
    headerBackTitle: "뒤로가기", // 뒤로가기 버튼 텍스트 수정
  }}>
    <Stack.Screen name="Main" component={Main} options={{ title: '게시글 목록' }} />
    {/* <Stack.Screen name="MainLogin" component={MainLogin} options={{title : "가게 로그인"}}/> */}
  </Stack.Navigator>
);

export default MainStack;
