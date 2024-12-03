import React from 'react';
//탭 기능
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons"; // 아이콘 라이브러리 import
import App from "../App";
import UserListStack from "./Home/UserListStack";
import TicketUserStack from "./Number/TicketUserStack";
import { TouchableOpacity, Text, StyleSheet,Image, View } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

const Tab = createBottomTabNavigator();

const TabNavigation = ({ deviceId, setSelectedRole, expoPushToken }) => {
  return (
    <Tab.Navigator
      initialRouteName="홈" // 기본으로 표시할 탭 설정
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "메인") {
            iconName = focused ? "list" : "list";
          } else if (route.name === "홈") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "번호표") {
            iconName = focused ? "receipt" : "receipt-outline";
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        headerShown: false,
        tabBarActiveTintColor: "#6661D5",
        tabBarInactiveTintColor: "gray",
      })}
    >
      {/* 메인 탭 */}
      <Tab.Screen
        name="메인"
        listeners={{
          tabPress: (e) => {
            e.preventDefault(); // 기본 탭 이동 방지
            setSelectedRole(null); // App.js로 이동
          },
        }}
        component={() => null} // 메인 탭은 아무것도 렌더링하지 않음
      />

      {/* 홈 탭 */}
      <Tab.Screen name="홈">
        {() => (
          <UserListStack
            deviceId={deviceId}
            expoPushToken={expoPushToken}
          />
        )}
      </Tab.Screen>

      {/* 번호표 탭 */}
      <Tab.Screen name="번호표">
        {() => <TicketUserStack deviceId={deviceId} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};



const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    flex: 1,
    


  
},
  button: {
    borderWidth:2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    marginTop: 50,
    marginLeft: '3%',
    marginRight: '3%',
    height: 70,
    borderRadius: 15,
    backgroundColor: '#6661D5'
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "bold",
  },
});
export default TabNavigation;