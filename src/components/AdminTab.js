import React from 'react';
//탭 기능
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons"; // 아이콘 라이브러리 import
import StoreRegisterEditStack from "./AdminNumber/StoreRegisterEditStack";
import StoreTicketStack from "./AdminNumber/StoreTicketStack";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const Tab = createBottomTabNavigator();

const TabNavigation = ({ deviceId, setSelectedRole  }) => {
  return (
    <Tab.Navigator
    initialRouteName="번호표 관리" 

      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "메인") {
            iconName = focused ? "list" : "list";
          } else if (route.name === "번호표 관리") {
            iconName = focused ? "clipboard" : "clipboard-outline";
          } else if (route.name === "가게 관리") {
            iconName = focused ? "settings" : "settings-outline";
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        headerShown: false, 
        tabBarActiveTintColor: "#6661D5", 
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="메인"
        listeners={{
          tabPress: (e) => {
            e.preventDefault(); 
            setSelectedRole(null); 
          },
        }}
        component={() => null} 
      />
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