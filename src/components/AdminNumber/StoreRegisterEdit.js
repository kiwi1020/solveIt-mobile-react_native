import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
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
import { LinearGradient } from "expo-linear-gradient";

// 가게 정보를 저장하거나 수정하는 컴포넌트
const StoreRegisterEdit = ({ route }) => {
  const [storeName, setStoreName] = useState("");
  const [images, setImages] = useState([]);
  const { deviceId, action } = route.params;

  let app;
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  const storage = getStorage(app);
  const db = getFirestore(app);

  // 기존에 저장되어있는 이미지 표시
  useEffect(() => {
    const fetchStoreData = async () => {
      const docRef = doc(db, "store", deviceId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const storeData = docSnap.data();
        setStoreName(storeData.name);

        const formattedImages = (storeData.images || []).map((url) => ({
          uri: url,
        }));
        setImages(formattedImages);
      } else {
        console.log("No such document!");
      }
    };
    fetchStoreData();
  }, [deviceId]);

  // 이미지 선택 함수
  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
    });

    if (!result.canceled) {
      setImages(result.assets);
    }
  };

  // 이미지 업로드 함수
  const uploadImages = async () => {
    const imageUrls = [];

    for (let i = 0; i < images.length; i++) {
      const uri = images[i].uri;
      const fileNameArray = uri.split("/");
      const fileName = fileNameArray[fileNameArray.length - 1];
      const storageRef = ref(
        storage,
        `store_images/${deviceId}/profile/${fileName}`
      );

      const response = await fetch(uri);
      const blob = await response.blob();
      await uploadBytes(storageRef, blob);

      const downloadURL = await getDownloadURL(storageRef);
      imageUrls.push(downloadURL);
    }

    return imageUrls;
  };

  // 등록 버튼 클릭 시 동작
  const handleRegister = async () => {
    if (!storeName) {
      alert("가게 이름을 입력해주세요.");
      return;
    }

    if (images.length === 0) {
      alert("이미지를 업로드해주세요.");
      return;
    }

    try {
      const imageUrls = await uploadImages();

      const docRef = doc(db, "store", deviceId);
      await setDoc(docRef, {
        name: storeName,
        images: imageUrls,
        storeCode: deviceId,
        nextNumber: 0,
        storeStatus: "closed",
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

    try {
      const imageUrls = await uploadImages();

      const docRef = doc(db, "store", deviceId);
      await updateDoc(docRef, {
        name: storeName,
        images: imageUrls,
        storeCode: deviceId,
        nextNumber: 0,
        storeStatus: "closed",
      });

      alert("가게 정보가 성공적으로 수정되었습니다!");
    } catch (error) {
      console.error("가게 수정 실패:", error);
      alert("가게 수정에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 등록/수정 버튼 텍스트 및 동작 분기
  const buttonTitle = action === "edit" ? "가게 수정" : "가게 등록";
  const handleButtonPress = action === "edit" ? handleEdit : handleRegister;

  return (
    <LinearGradient
      style={styles.container}
      colors={["#BFC0D6", "#CBBCD8"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.5, y: 0 }}
    >
      <View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View style={styles.content}>
            <Text style={styles.header}>
              {action === "edit" ? "가게 정보 수정" : "가게 등록"}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="가게 이름을 입력하세요"
              value={storeName}
              onChangeText={setStoreName}
            />

            <Text style={styles.label}>가게 이미지</Text>
            <TouchableOpacity style={styles.imageUpload} onPress={pickImages}>
              <View style={styles.imageContainer}>
                {images.length > 0 ? (
                  images.map((image, index) => (
                    <Image
                      key={index}
                      source={{ uri: image.uri }}
                      style={styles.image}
                    />
                  ))
                ) : (
                  <Text style={styles.uploadText}>이미지 업로드</Text>
                )}
              </View>
            </TouchableOpacity>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={handleButtonPress}
              >
                <Text style={styles.buttonText}>{buttonTitle}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
    backgroundColor: "#F4F7FC", // 부드러운 배경색
  },
  content: {
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.8)", // 살짝 투명한 배경
    borderRadius: 15,
    elevation: 5, // 그림자 효과
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3E4A59", // 고급스러운 텍스트 색상
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4A4A4A", // 부드러운 텍스트 색상
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderColor: "#D1D5DB", // 더 부드러운 회색
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 15,
    marginBottom: 20,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  imageUpload: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9F9F9", // 부드러운 배경색
  },
  image: {
    width: 75,
    height: 75,
    margin: 5,
    borderRadius: 10,
  },
  uploadText: {
    color: "#6B7280",
    fontSize: 14,
  },
  buttonContainer: {
    marginTop: 20,
    borderRadius: 10,
    overflow: "hidden", // 버튼의 둥근 모서리 효과를 위한 overflow
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3, // 그림자 효과
  },
  buttonText: {
    color: "6661D5",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonHovered: {
    backgroundColor: "#3A56E3", // 마우스 오버 효과 (터치 이벤트로 대체)
  },
  imageContainer: {
    flexDirection: "row", // 수평 배치
    justifyContent: "flex-start", // 왼쪽 정렬 (필요에 따라 변경 가능)
    alignItems: "center", // 세로 중앙 정렬
    flexWrap: "wrap", // 화면이 넘어가면 줄바꿈 (필요 없다면 제거)
  },
});
export default StoreRegisterEdit;
