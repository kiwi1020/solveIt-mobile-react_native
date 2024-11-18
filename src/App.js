import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"; // View와 Text 가져오기
import AsyncStorage from "@react-native-async-storage/async-storage"; // 로컬 저장소
import uuid from "react-native-uuid"; // UUID 라이브러리
import TabNavigation from "./components/Tab"; // 일반 사용자 탭 네비게이션
import AdminTabNavigation from "./components/AdminTab"; // 가게 관리 탭 네비게이션

export default function App() {
  const [deviceId, setDeviceId] = useState(null); // UUID 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [selectedRole, setSelectedRole] = useState(null); // 역할 선택 상태

  useEffect(() => {
    const fetchOrCreateUUID = async () => {
      try {
        const storedId = await AsyncStorage.getItem("deviceId");

        if (storedId) {
          setDeviceId(storedId); // 저장된 UUID 사용
          console.log("기존 UUID 사용:", storedId);
        } else {
          const newId = uuid.v4();
          await AsyncStorage.setItem("deviceId", newId); // UUID 저장
          setDeviceId(newId); // 상태 업데이트
          console.log("새 UUID 생성:", newId);
        }
      } catch (error) {
        console.error("UUID 처리 오류:", error);
      } finally {
        setLoading(false); // 로딩 상태 해제
      }
    };

    fetchOrCreateUUID();
  }, []);

  if (loading) {
    // 로딩 중일 때 화면 표시
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>로딩 중...</Text>
      </View>
    );
  }

  // 역할 선택 화면
  if (!selectedRole) {
    return (
      <View style={styles.roleSelectionContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setSelectedRole("user")}
        >
          <Text style={styles.buttonText}>일반 사용자</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setSelectedRole("admin")}
        >
          <Text style={styles.buttonText}>가게 관리자</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <NavigationContainer>
  {selectedRole === "user" ? (
    <TabNavigation deviceId={deviceId} setSelectedRole={setSelectedRole} />
  ) : (
    <AdminTabNavigation deviceId={deviceId} setSelectedRole={setSelectedRole} />
  )}
</NavigationContainer>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: "#6661D5",
  },
  button: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 10,
    borderRadius: 5,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#6661D5",
    fontSize: 18,
    fontWeight: "bold",
  },
});
