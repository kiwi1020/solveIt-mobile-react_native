import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";
import TabNavigation from "./components/Tab";
import AdminTabNavigation from "./components/AdminTab";

export default function App() {
  const [deviceId, setDeviceId] = useState(""); // UUID 상태 초기화
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [selectedRole, setSelectedRole] = useState(null); // 역할 선택 상태
  const [isValid, setIsValid] = useState(true); // UUID 유효성 상태

  useEffect(() => {
    const fetchOrCreateUUID = async () => {
      try {
        const storedId = await AsyncStorage.getItem("deviceId");

        if (storedId) {
          setDeviceId(storedId);
          console.log("기존 UUID 사용:", storedId);
        } else {
          // 테스트용 고정 UUID 설정
          // const testId = "123e4567-e89b-12d3-a456-426614174000"; // 원하는 UUID
          // await AsyncStorage.setItem("deviceId", testId); // UUID 저장
          // setDeviceId(testId); // 상태 업데이트
          // console.log("테스트 UUID 사용:", testId);
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

    fetchOrCreateUUID();
  }, []);

  // UUID 형식 검증 함수
  const isValidUUID = (id) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  };

  // TextInput 변경 시 유효성 검사 실행
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

  // 역할 선택 화면
  if (!selectedRole) {
    return (
      <View style={styles.roleSelectionContainer}>
        <TouchableOpacity
          style={[styles.button, !isValid && styles.disabledButton]} // 비활성화 스타일 추가
          onPress={() => setSelectedRole("user")}
          disabled={!isValid} // 유효하지 않으면 버튼 비활성화
        >
          <Text style={styles.buttonText}>일반 사용자</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, !isValid && styles.disabledButton]} // 비활성화 스타일 추가
          onPress={() => setSelectedRole("admin")}
          disabled={!isValid} // 유효하지 않으면 버튼 비활성화
        >
          <Text style={styles.buttonText}>가게 관리자</Text>
        </TouchableOpacity>

        
        <TextInput
          style={[styles.input, !isValid && { borderColor: "red", borderWidth: 2 }]} // 유효하지 않으면 빨간 테두리
          placeholder="UUID 입력 (유효한 UUID 형식)"
          value={deviceId}
          onChangeText={handleInputChange}
        />
        {!isValid && <Text style={styles.errorText}>유효한 UUID를 입력해주세요.</Text>}
      </View>
    );
  }

  return (
    <NavigationContainer>
      {selectedRole === "user" ? (
        <TabNavigation deviceId={deviceId} setSelectedRole={setSelectedRole} />
      ) : (
        <AdminTabNavigation
          deviceId={deviceId}
          setSelectedRole={setSelectedRole}
        />
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
  disabledButton: {
    backgroundColor: "#aaa", // 비활성화 시 회색
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
