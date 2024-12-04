import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Button,
  FlatList,
  Image,
  Dimensions,
  Animated,
} from "react-native";
import firebaseApp from "../../firebase/firebaseConfig";
import { getFirestore, doc, getDoc, collection } from "firebase/firestore";
import { runTransaction } from "firebase/firestore";
import { LinearGradient } from "expo-linear-gradient";

const db = getFirestore(firebaseApp);

export default function StoreDetail({ route, navigation  }) {
  const [ticketNumber, setTicketNumber] = useState(null); // 대기표 번호 저장
  const [personnel, setPersonnel] = useState(1); // 기본 인원 수 (최소 1명)
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [canDrawTicket, setCanDrawTicket] = useState(true); // 대기표 뽑기 가능 여부
  const [storeImages, setStoreImages] = useState([]); // 가게 이미지 배열 저장
  const {storeCode, deviceId, expoPushToken } = route.params; // storeCode는 가게 UUID이고 deviceId는 사용자 UUID임
  const [storeName, setStoreName] = useState(""); // 가게 이름 상태
  const [scale, setScale] = useState(new Animated.Value(1));
  const [pulseScale] = useState(new Animated.Value(1)); // 테두리 애니메이션 크기
  const [pulseOpacity] = useState(new Animated.Value(1)); // 테두리 애니메이션 투명도
  const [modalVisible, setModalVisible] = useState(false);  // 모달의 상태를 관리
  const [selectedImage, setSelectedImage] = useState(null); // 선택된 이미지 URL 저장
  // 화면의 크기를 얻어 슬라이드 이미지 크기 설정
  const { width } = Dimensions.get("window");

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.parallel([
        Animated.timing(pulseScale, {
          toValue: 2.5, 
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseOpacity, {
          toValue: 0, 
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };


  useEffect(() => {
    if (canDrawTicket) {
      startPulseAnimation();
    } else {
      pulseScale.setValue(1);
      pulseOpacity.setValue(1);
    }
  }, [canDrawTicket]);

  useEffect(() => {
    const checkUserTicket = async () => {
      try {
        const userRef = doc(db, "users", deviceId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          setCanDrawTicket(false); 
          console.log("이미 대기표를 뽑았습니다.");
        }
      } catch (error) {
        console.error("대기표 확인 중 오류:", error);
      }
    };

    

    checkUserTicket();

    const fetchStoreImages = async () => {
      try {
        const storeRef = doc(db, "store", storeCode);
        const storeDoc = await getDoc(storeRef);

        if (storeDoc.exists()) {
          const images = storeDoc.data().images || []; 
          setStoreImages(images);
        }
      } catch (error) {
        console.error("가게 이미지 로드 실패:", error);
      }
    };

    const fetchStoreName = async () => {
      try {
        const storeRef = doc(db, "store", storeCode); 
        const storeDoc = await getDoc(storeRef); 

        if (storeDoc.exists()) {
          const storeData = storeDoc.data(); 
          setStoreName(storeData.name || ""); 
          navigation.setOptions({ title: storeData.name || "가게 이름 없음" }); 

        } else {
          console.error("가게 문서를 찾을 수 없습니다.");
        }
      } catch (error) {
        console.error("가게 이름 가져오기 오류:", error);
      }
    };
    fetchStoreName(); 

    fetchStoreImages();
  }, [deviceId, storeCode]);

  const createTicketWithSubCollection = async (storeCode) => {
    try {
      setLoading(true);

      const nextNumber = await runTransaction(db, async (transaction) => {
        const storeRef = doc(db, "store", storeCode);

        const storeDoc = await transaction.get(storeRef);
        let nextNumber = 1; 
        if (storeDoc.exists()) {
          nextNumber = storeDoc.data().nextNumber + 1;
        }

        transaction.set(storeRef, { nextNumber }, { merge: true });

        const userRef = doc(db, "users", deviceId);
        transaction.set(
          userRef,
          {
            storeCode,
            number: nextNumber,
            state: "waiting",
            personnel: personnel,
            expoPushToken: expoPushToken,
          },
          { merge: true }
        );

        const ticketRef = doc(
          collection(db, "store", storeCode, "tickets"),
          deviceId
        );
        transaction.set(ticketRef, {
          number: nextNumber,
          state: "waiting",
          personnel: personnel,
          expoPushToken: expoPushToken,
        });

        return nextNumber;
      });

      setTicketNumber(nextNumber);
      setCanDrawTicket(false);
      console.log(`Ticket ${nextNumber} created for store ${storeCode}`);
    } catch (error) {
      console.error("Transaction failed: ", error);
    } finally {
      setLoading(false);
    }
  };


  const increasePersonnel = () => {
    setPersonnel((prev) => prev + 1);
  };


  const decreasePersonnel = () => {
    setPersonnel((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 1.3, 
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1, 
      useNativeDriver: true,
    }).start();
  };

   const openModal = (imageUri) => {
    setSelectedImage(imageUri);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };


 return (
  <LinearGradient
    style={styles.container}
    colors={["#BFC0D6", "#CBBCD8"]}
    start={{ x: 0, y: 0 }} // 왼쪽에서 시작
    end={{ x: 0.5, y: 0 }} // 오른쪽에서 끝
  >
    <View style={styles.contentContainer}>  
      <FlatList
        data={storeImages}
        horizontal
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openModal(item)}>
            <Image
              source={{ uri: item }}
              style={[styles.image, { width: width - 40 }]} // 화면 크기에 맞게 이미지 크기 설정
            />
          </TouchableOpacity>
        )}
        style={styles.flatList} // FlatList 전체 크기 제한
      />

      
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={closeModal} // 모달을 닫을 때 호출되는 함수
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <Text style={styles.closeText}>X</Text>
          </TouchableOpacity>
          <Image source={{ uri: selectedImage }} style={styles.modalImage} resizeMode="contain" />
        </View>
      </Modal>
      
      <View style={styles.ticketContainer}>
    <Animated.View
        style={[
            styles.pulseCircle,
            {
                transform: [{ scale: pulseScale }],
                opacity: pulseOpacity,
            },
        ]}
    />
    <Animated.View style={{ transform: [{ scale }] }}>
        <TouchableOpacity
            style={canDrawTicket ? styles.ticketButton : styles.noneTicketButton}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={() => createTicketWithSubCollection(storeCode)}
            activeOpacity={0.7}
            disabled={loading || !canDrawTicket}
        >
            <Text style={styles.ticketButtonText}>
                {loading ? "대기표 생성 중..." : "클릭"}
            </Text>
        </TouchableOpacity>
    </Animated.View>
</View>



      <View style={styles.textContainer}>
        <Text style={styles.header}>인원 수</Text>
      </View>

      <View style={styles.counterContainer}>
        <TouchableOpacity style={styles.button} onPress={decreasePersonnel}>
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>

        <Text style={styles.counter}>{personnel}</Text>

        <TouchableOpacity style={styles.button} onPress={increasePersonnel}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.text}>{canDrawTicket
              ? ""
              : "이미 대기표를 뽑았습니다"}</Text> 
    </View>
  </LinearGradient>
);
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#6661D5",
  },
  contentContainer: {
    flex: 1,               // 부모 컨테이너가 화면 전체를 차지하도록 설정
    justifyContent: 'center', // 수직 중앙 정렬
    alignItems: 'center',     // 수평 중앙 정렬
    
  },
  flatList: {
    maxHeight: 200, // FlatList 전체 높이 제한
    marginBottom: 30,
  },
  nameContainer: {
    marginTop: 10,
    
    alignSelf: "flex-start", // 부모 컨테이너의 시작 부분으로 정렬
    marginLeft: '5%',
  },
  storeName: {
    fontWeight: "bold",
    fontSize: 30,
    color: "#FFFFFF",
    textAlign: "left", // 가로 축 중앙 정렬
  },
  textContainer: {
    alignItems: "center", // 가로 축 중앙 정렬
  justifyContent: "center", // 세로 축 중앙 정렬
  width: "100%", // 부모 컨테이너에 맞게 너비 설정
  
  },
  header: {
    marginTop: 70,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
    textAlign: "center", // 텍스트 자체 중앙 정렬
  },
  counterContainer: {
    flexDirection: "row", // 아이템을 가로로 배치
    alignItems: "center", // 세로 축 중앙 정렬
    justifyContent: "center", // 가로 축 중앙 정렬
    marginBottom: 5, // 아래 간격을 5px로 설정
    width: "100%", // 부모 요소 기준으로 중앙 정렬되도록 설정
  },
  button: {
    borderRadius: 20, // 버튼을 둥글게 설정 (90/2)
    width: 60, // 버튼의 크기 설정
    height: 60, // 버튼의 크기 설정
    justifyContent: "center", // 수직 중앙 정렬
    alignItems: "center", // 수평 중앙 정렬
    marginHorizontal: 10, // 버튼 간격 유지
    backgroundColor: "#ffffff", // 배경색 추가 (선택 사항)
    
      // iOS 섀도우
    shadowColor: "#000", // 섀도우 색상
    shadowOffset: { width: 0, height: 4 }, // 섀도우 위치
    shadowOpacity: 0.25, // 섀도우 투명도
    shadowRadius: 4, // 섀도우 반경
    // Android 섀도우
    elevation: 5, // Android 섀도우 높이
  },
  buttonText: {
    color: "#000000", // 텍스트 색상
    fontSize: 30, // 텍스트 크기
    fontWeight: "bold", // 텍스트 두께
  },
  counter: {
    padding:10,
    fontSize: 18,
    fontWeight: "bold",
  },
  ticketInfo: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  image: {
    height: 200, // 이미지 높이 설정
    marginHorizontal: 10, // 이미지 간격 설정
    borderRadius: 10,
  },
  ticketButton: {
    
    width: 150,
    height: 150,
    borderRadius: 90,
    backgroundColor: "#D598E6",
    justifyContent: "center",
    alignItems: "center",
    // iOS 섀도우
    shadowColor: "#000", // 섀도우 색상
    shadowOffset: { width: 0, height: 4 }, // 섀도우 위치
    shadowOpacity: 0.25, // 섀도우 불투명도
    shadowRadius: 4, // 섀도우 반경
    // Android 섀도우
    elevation: 5, // Android 섀도우 높이
  },
  ticketButtonText: {
    color: "#fff", // 텍스트 색상 (흰색으로 설정)
    fontSize: 18, // 텍스트 크기
    fontWeight: "bold", // 텍스트 두께
  },
  noneTicketButton: {
    width: 150,
    height: 150,
    borderRadius: 90,
    backgroundColor: "#EAEAEA",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontWeight: "bold",
    fontSize: 25,
    color: "#FFFFFF",
  },
  pulseCircle: {
    position: "absolute",
    width: 80, // 기존 100에서 80으로 줄임
    height: 80, // 기존 100에서 80으로 줄임
    borderRadius: 40, // 반지름도 줄임
    borderWidth: 2,
    borderColor: "#BF65D9",
    alignSelf: "center",
    
  },
  ticketContainer: {
    position: "relative", // 자식 요소의 절대 위치를 기준으로 함
    justifyContent: "center", // 수직 중앙 정렬
    alignItems: "center", // 수평 중앙 정렬
    width: 100, // 버튼 크기와 동일
    height: 100, // 버튼 크기와 동일
    marginTop:40,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // 배경을 반투명하게 만들어 모달이 강조되도록 함
  },
  modalImage: {
    width: '90%',
    height: '90%',
  },
  closeButton: {
    position: 'absolute',
    top: 30,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 10,
    zIndex: 1,
  },
  closeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});
