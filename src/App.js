import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Button, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";
import TabNavigation from "./components/Tab";
import AdminTabNavigation from "./components/AdminTab";
import { LinearGradient } from 'expo-linear-gradient';
import * as Notifications from "expo-notifications";

export default function App() {
  const [deviceId, setDeviceId] = useState(""); // UUID 상태 초기화
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [selectedRole, setSelectedRole] = useState(null); // 역할 선택 상태
  const [isValid, setIsValid] = useState(true); // UUID 유효성 상태
  const [expoPushToken, setExpoPushToken] = useState(null); // Expo Push Token 저장

  useEffect(() => {
    const fetchOrCreateUUID = async () => {
      try {
        const storedId = await AsyncStorage.getItem("deviceId");

        if (storedId) {
          setDeviceId(storedId);
          console.log("기존 UUID 사용:", storedId);
        } else {
          const newId = uuid.v4();
          await AsyncStorage.setItem("deviceId", newId);
          setDeviceId(newId);
          console.log("새 UUID 생성:", newId);
        }
      } catch (error) {
        console.error("UUID 처리 오류:", error);
      } finally {
        setLoading(false);
      }
    };

    const registerForPushNotificationsAsync = async () => {
      try {
        // 알림 권한 요청
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== "granted") {
          Alert.alert("푸시 알림 권한이 거부되었습니다.");
          return;
        }

        // Expo Push Token 가져오기
        const token = (await Notifications.getExpoPushTokenAsync({
          // expo ID
          projectId: "d83c8420-525a-44c2-aca4-212b1481ddec"
        })).data;
        console.log("Expo Push Token:", token);
        setExpoPushToken(token);
      } catch (error) {
        console.error("푸시 토큰 가져오기 실패:", error);
      }
    };

    fetchOrCreateUUID();
    registerForPushNotificationsAsync();
    
  }, []);

  const isValidUUID = (id) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  };

  const handleInputChange = (text) => {
    setDeviceId(text);
    setIsValid(isValidUUID(text));
  };


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>로딩 중...</Text>
      </View>
    );
  }

  if (!selectedRole) {
    return (
      <LinearGradient 
      style={styles.container} 
      colors={['#BFC0D6', '#CBBCD8']}
      start={{ x: 0, y: 0 }} // 왼쪽에서 시작
      end={{ x: 0.5, y: 0 }} // 오른쪽에서 끝
>

      <View style={styles.roleSelectionContainer}>
        <TouchableOpacity style={[styles.button, !isValid && styles.disabledButton]} onPress={() => setSelectedRole("user")} disabled={!isValid}>
          <Text style={styles.buttonText}>일반 사용자</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, !isValid && styles.disabledButton]} onPress={() => setSelectedRole("admin")} disabled={!isValid}>
          <Text style={styles.buttonText}>가게 관리자</Text>
        </TouchableOpacity>

        <TextInput
          style={[styles.input, !isValid && { borderColor: "red", borderWidth: 2 }]}
          placeholder="UUID 입력 (유효한 UUID 형식)"
          value={deviceId}
          onChangeText={handleInputChange}
        />
        {!isValid && <Text style={styles.errorText}>유효한 UUID를 입력해주세요.</Text>}
      </View>
      </LinearGradient>

    );
  }

  return (
    <NavigationContainer>
      {selectedRole === "user" ? (
        <TabNavigation deviceId={deviceId} setSelectedRole={setSelectedRole} expoPushToken={expoPushToken} />
      ) : (
        <AdminTabNavigation deviceId={deviceId} setSelectedRole={setSelectedRole} expoPushToken={expoPushToken} />
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    flex: 1,
    justifyContent:"center",
    alignItems:"center",
},
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#6661D5",
  },
  loadingText: {
    fontSize: 20,
    color: "#fff",
  },
  roleSelectionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 10,
    borderRadius: 5,
    width: "80%",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#aaa",
  },
  buttonText: {
    color: "#6661D5",
    fontSize: 18,
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    width: "80%",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 5,
  },
});
