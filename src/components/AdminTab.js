import React from 'react';
//탭 기능
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons"; // 아이콘 라이브러리 import
import App from "../App";
import StoreRegisterEditStack from "./AdminNumber/StoreRegisterEditStack";
import StoreTicketStack from "./AdminNumber/StoreTicketStack";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const Tab = createBottomTabNavigator();

const TabNavigation = ({ deviceId, setSelectedRole  }) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          // 라우트 이름에 따라 아이콘 선택
          if (route.name === "메인") {
            iconName = focused ? "list" : "list";
          } else if (route.name === "홈") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "번호표") {
            iconName = focused ? "receipt" : "receipt-outline";
          }

          // 아이콘 렌더링
          return <Icon name={iconName} size={size} color={color} />;
        },
        headerShown: false, // 모든 탭의 상단 헤더 숨김
        tabBarActiveTintColor: "#6661D5", // 활성화된 탭 색상
        tabBarInactiveTintColor: "gray", // 비활성화된 탭 색상
      })}
    >
      {/* 각 스택에 deviceId 전달 */}
      <Tab.Screen name="메인">
        {() => (
          <TouchableOpacity
            style={styles.button}
            onPress={() => setSelectedRole(null)}
          >
            <Text style={styles.buttonText}>메인으로 돌아가기</Text>
          </TouchableOpacity>
        )}
      </Tab.Screen>
      <Tab.Screen name="번호표 관리">
        {() => <StoreTicketStack deviceId={deviceId} />}
      </Tab.Screen>
      <Tab.Screen name="가게 관리">
        {() => <StoreRegisterEditStack deviceId={deviceId} />}
      </Tab.Screen>
      
    </Tab.Navigator>
  );
};


const styles = StyleSheet.create({
    button: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#fff",
    },
    buttonText: {
      color: "#6661D5",
      fontSize: 18,
      fontWeight: "bold",
    },
  });

export default TabNavigation;