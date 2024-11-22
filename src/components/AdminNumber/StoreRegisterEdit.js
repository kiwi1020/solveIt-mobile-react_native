import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker"; // 이미지 선택을 위한 라이브러리 사용
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getApps, initializeApp } from "firebase/app"; // Firebase 앱 초기화
import { firebaseConfig } from "../../firebase/firebaseConfig"; // Firebase config 파일 (필요한 경우)
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

const StoreRegisterEdit = ({ route }) => {
  const [storeName, setStoreName] = useState("");
  const [image, setImage] = useState(null);
  const { deviceId, action } = route.params; // action 값 가져오기

  let app;
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  const storage = getStorage(app); // Firebase Storage 참조
  const db = getFirestore(app);

  // 이미지 선택 함수
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  // 등록 버튼 클릭 시 동작
  const handleRegister = async () => {
    if (!storeName) {
      alert("가게 이름을 입력해주세요.");
      return;
    }

    if (!image) {
      alert("이미지를 업로드해주세요.");
      return;
    }

    try {
      const uri = image.uri;
      const fileNameArray = uri.split("/");
      const fileName = fileNameArray[fileNameArray.length - 1]; // 파일 이름 추출
      const storageRef = ref(storage, `store_images/${deviceId}/profile`);

      // 파일 업로드
      const response = await fetch(uri);
      const blob = await response.blob();
      await uploadBytes(storageRef, blob); // 이미지 업로드

      // 업로드 완료 후 다운로드 URL 가져오기
      const downloadURL = await getDownloadURL(storageRef);
      console.log("파일 업로드 성공123:", downloadURL);

      const docRef = doc(db, "store", "store123");
      await setDoc(docRef, {
        name: storeName,
        image: downloadURL,
        deviceId: deviceId,
      });

      alert("가게 정보가 성공적으로 등록되었습니다!");
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
      alert("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 수정 버튼 클릭 시 동작
  const handleEdit = async () => {
    if (!storeName) {
      alert("가게 이름을 입력해주세요.");
      return;
    }

    // 수정 로직 (예: 이미 등록된 가게 이름이나 이미지 업데이트)
    try {
      const uri = image.uri;
      const fileNameArray = uri.split("/");
      const fileName = fileNameArray[fileNameArray.length - 1]; // 파일 이름 추출
      const storageRef = ref(storage, `store_images/${deviceId}/profile`);

      // 파일 업로드
      const response = await fetch(uri);
      const blob = await response.blob();
      await uploadBytes(storageRef, blob); // 이미지 업로드

      // 업로드 완료 후 다운로드 URL 가져오기
      const downloadURL = await getDownloadURL(storageRef);
      console.log("파일 업로드 성공:", downloadURL);
      
      const docRef = doc(db, "store", "store123");
      await setDoc(docRef, {
        name: storeName,
        image: downloadURL,
        deviceId: deviceId,
        storeCode: "store123",
        nextNumber: 0,
      });
      
      alert("가게 정보가 성공적으로 수정되었습니다!");
      // 수정된 정보 저장 로직 추가 (예: API 호출)
    } catch (error) {
      console.error("가게 수정 실패:", error);
      alert("가게 수정에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 등록/수정 버튼 텍스트 및 동작 분기
  const buttonTitle = action === "edit" ? "가게 수정" : "가게 등록";
  const handleButtonPress = action === "edit" ? handleEdit : handleRegister;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {action === "edit" ? "가게 정보 수정" : "가게 등록"}
      </Text>
      <TextInput
        style={styles.input}
        placeholder="가게 이름을 입력하세요"
        value={storeName}
        onChangeText={setStoreName}
      />

      <Text style={styles.label}>가게 이미지</Text>
      <TouchableOpacity style={styles.imageUpload} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image.uri }} style={styles.image} />
        ) : (
          <Text style={styles.uploadText}>이미지 업로드</Text>
        )}
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <Button title={buttonTitle} onPress={handleButtonPress} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  imageUpload: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 20,
  },
  uploadText: {
    color: "#888",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default StoreRegisterEdit;
