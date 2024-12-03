import React, { useState } from "react";
import {
  View,
  Button,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
import {
  getStorage,
  ref,
  getMetadata,
  deleteObject,
  listAll,
} from "firebase/storage";
import { getApps, initializeApp } from "firebase/app";
import { firebaseConfig } from "../../firebase/firebaseConfig";
import { useFocusEffect } from "@react-navigation/native";
import {
  deleteDoc,
  doc,
  getFirestore,
  collection,
  getDocs,
  getDoc,
  writeBatch,
} from "firebase/firestore";
import { LinearGradient } from "expo-linear-gradient";

const StoreRegisterButton = ({ navigation, route }) => {
  const [loading, setLoading] = useState(true);
  const [imageExists, setImageExists] = useState(false);
  const [storeStatus, setStoreStatus] = useState("");
  const { deviceId } = route.params;

  // Firebase 초기화
  let app;
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  const storage = getStorage(app);
  const db = getFirestore(app);

  useFocusEffect(
    React.useCallback(() => {
      const checkImageExists = async () => {
        try {
          // Firebase Storage 경로 확인 (deviceId로 경로 구성)
          const folderRef = ref(storage, `store_images/${deviceId}/profile`);

          // profile 폴더 내 파일 리스트 가져오기
          const result = await listAll(folderRef);

          if (result.items.length > 0) {
            // 파일이 하나 이상 있으면 true 설정
            console.log(
              "Images found in profile folder:",
              result.items.map((item) => item.fullPath)
            );
            setImageExists(true);
          } else {
            // 파일이 없으면 false 설정
            console.log("No images found in profile folder.");
            setImageExists(false);
          }
        } catch (error) {
          console.error("Error checking profile folder:", error);
          setImageExists(false); // 오류 발생 시 false 설정
        } finally {
          setLoading(false);
        }
      };
      getStoreStatus();
      checkImageExists();
    }, [deviceId])
  );

  const getStoreStatus = async () => {
    const storeRef = doc(db, "store", deviceId);
    const storeDoc = await getDoc(storeRef);
    if (storeDoc.exists()) {
      const storeData = storeDoc.data();
      if (storeData.storeStatus === "open")
        setStoreStatus("가게를 오픈했습니다!");
      else setStoreStatus("가게를 마감했습니다!");
    }
  };
  const deleteStore = async () => {
    try {
      // Firestore에서 가게 데이터 삭제
      const storeRef = doc(db, "store", deviceId); // 'store' 컬렉션에서 deviceId 문서 참조
      await deleteDoc(storeRef);
      console.log("Firestore에서 가게 데이터 삭제 완료");

      // 'tickets' 컬렉션 내 모든 문서 삭제
      const ticketsRef = collection(db, "store", deviceId, "tickets"); // 'store/{deviceId}/tickets' 컬렉션 참조
      const querySnapshot = await getDocs(ticketsRef); // 모든 문서 가져오기

      // 문서들 삭제
      querySnapshot.forEach(async (docSnapshot) => {
        await deleteDoc(doc(db, "store", deviceId, "tickets", docSnapshot.id)); // 각 문서 삭제
        console.log(`Ticket with ID ${docSnapshot.id} 삭제 완료`);
      });
      // Storage에서 가게 이미지 삭제
      const folderRef = ref(storage, `store_images/${deviceId}/profile`);

      // 폴더 내 모든 파일 목록 가져오기
      const result = await listAll(folderRef);

      // 파일이 있을 경우 모두 삭제
      for (const item of result.items) {
        await deleteObject(item);
        console.log(`Storage에서 이미지 삭제 완료: ${item.fullPath}`);
      }

      console.log("Storage에서 가게 이미지 삭제 완료");

      // 삭제 성공 후 피드백 제공 및 다른 화면으로 이동
      alert("가게가 성공적으로 삭제되었습니다.");
      navigation.replace("StoreRegisterButton", { deviceId }); // 같은 화면을 새로 로드
    } catch (error) {
      console.error("가게 삭제 중 오류 발생:", error);
      alert("가게를 삭제하는 중 문제가 발생했습니다.");
    }
  };

  const updateStoreStatus = async (status) => {
    const storeRef = doc(db, "store", deviceId);
    const batch = writeBatch(db);

    if (status === "open") {
      batch.update(storeRef, { storeStatus: "open" });
      setStoreStatus("가게를 오픈했습니다!");
      Alert.alert("가게를 오픈했습니다!");
    } else {
      batch.update(storeRef, { storeStatus: "closed" });
      setStoreStatus("가게를 마감했습니다!");
      Alert.alert("가게를 마감했습니다!");
    }
    await batch.commit();
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <LinearGradient
      style={styles.container}
      colors={["#BFC0D6", "#CBBCD8"]}
      start={{ x: 0, y: 0 }} // 왼쪽에서 시작
      end={{ x: 0.5, y: 0 }} // 오른쪽에서 끝
    >
      <Text
        style={{
          fontSize: 30,
          color: "#ffffff",
          textAlign: "center",
          marginTop: -50,
          marginBottom: 50,
        }}
      >
        {storeStatus}
      </Text>
      <View style={styles.buttonContainer}>
        {imageExists ? (
          <>
            {/* 첫 번째 행: 가게 수정, 가게 삭제 */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.editButton]}
                onPress={() =>
                  navigation.navigate("StoreRegisterEdit", {
                    deviceId,
                    action: "edit",
                  })
                }
              >
                <Text style={styles.buttonText}>가게 수정</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.deleteButton]}
                onPress={deleteStore}
              >
                <Text style={styles.buttonText}>가게 삭제</Text>
              </TouchableOpacity>
            </View>

            {/* 두 번째 행: 가게 오픈, 가게 마감 */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.openButton]}
                onPress={() => updateStoreStatus("open")}
              >
                <Text style={styles.buttonText}>가게 오픈</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.registerButton]}
                onPress={() => updateStoreStatus("closed")}
              >
                <Text style={styles.buttonText}>가게 마감</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <TouchableOpacity
            style={[styles.button, styles.registerButton]}
            onPress={() =>
              navigation.navigate("StoreRegisterEdit", {
                deviceId,
                action: "register",
              })
            }
          >
            <Text style={styles.buttonText}>가게 등록</Text>
          </TouchableOpacity>
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6661D5",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    width: "90%",
    paddingHorizontal: 20,
  },
  buttonRow: {
    flexDirection: "row", // 버튼을 가로로 배치
    justifyContent: "space-between", // 버튼 사이 간격 균등
    marginVertical: 5, // 버튼 그룹 간 간격
  },
  button: {
    flex: 1, // 버튼 크기 균등 배분
    paddingVertical: 15,
    marginHorizontal: 5, // 버튼 사이 여백
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    height: 130,
  },
  registerButton: {
    backgroundColor: "#fff",
  },
  editButton: {
    backgroundColor: "#fff",
  },
  deleteButton: {
    backgroundColor: "#fff",
  },
  openButton: {
    backgroundColor: "#fff",
  },
  buttonText: {
    color: "#6661D5",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default StoreRegisterButton;
