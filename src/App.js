import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { View, Text, StyleSheet } from "react-native"; // View와 Text 가져오기
import TabNavigation from "./components/Tab";
import AsyncStorage from "@react-native-async-storage/async-storage"; // 로컬 저장소
import uuid from "react-native-uuid"; // UUID 라이브러리

export default function App() {
  const [deviceId, setDeviceId] = useState(null); // UUID 상태
  const [loading, setLoading] = useState(true); // 로딩 상태

  useEffect(() => {
    const fetchOrCreateUUID = async () => {
      try {
        // AsyncStorage에서 UUID 가져오기
        const storedId = await AsyncStorage.getItem("deviceId");

        if (storedId) {
          setDeviceId(storedId); // 저장된 UUID 사용
          console.log("기존 UUID 사용:", storedId);
        } else {
          // 저장된 UUID가 없으면 새로 생성
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

  return (
    <NavigationContainer>
      {/* UUID를 TabNavigation에 전달 */}
      <TabNavigation deviceId={deviceId} />
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
});
