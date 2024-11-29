import React, { useState } from "react";
import { View, Button, ActivityIndicator, StyleSheet } from "react-native";
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
import { deleteDoc, doc, getFirestore, collection, getDocs } from "firebase/firestore";

const StoreRegisterButton = ({ navigation, route }) => {
  const [loading, setLoading] = useState(true);
  const [imageExists, setImageExists] = useState(false);
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

      checkImageExists();
    }, [deviceId])
  );

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

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {imageExists ? (
        <>
          <Button
            title="가게 수정"
            onPress={() =>
              navigation.navigate("StoreRegisterEdit", {
                deviceId,
                action: "edit",
              })
            }
          />
          <Button title="가게 삭제" onPress={deleteStore}></Button>
        </>
      ) : (
        <Button
          title="가게 등록"
          onPress={() =>
            navigation.navigate("StoreRegisterEdit", {
              deviceId,
              action: "register",
            })
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    alignItems: "center",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default StoreRegisterButton;
