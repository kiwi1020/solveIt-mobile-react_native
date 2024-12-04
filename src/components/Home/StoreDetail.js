import React, { useState, useEffect } from "react";
import {
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

export default function StoreDetail({ route }) {
  const [ticketNumber, setTicketNumber] = useState(null); // 대기표 번호 저장
  const [personnel, setPersonnel] = useState(1); // 기본 인원 수 (최소 1명)
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [canDrawTicket, setCanDrawTicket] = useState(true); // 대기표 뽑기 가능 여부
  const [storeImages, setStoreImages] = useState([]); // 가게 이미지 배열 저장
  const {storeCode, deviceId, expoPushToken } = route.params; // storeCode는 가게 UUID이고 deviceId는 사용자 UUID임
  const [storeName, setStoreName] = useState(""); // 가게 이름 상태
  const [scale, setScale] = useState(new Animated.Value(1));

  // 화면의 크기를 얻어 슬라이드 이미지 크기 설정
  const { width } = Dimensions.get("window");

  // 사용자 대기표 여부 확인
  useEffect(() => {
    const checkUserTicket = async () => {
      try {
        const userRef = doc(db, "users", deviceId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          setCanDrawTicket(false); // 이미 대기표가 있음 -> 버튼 비활성화
          console.log("이미 대기표를 뽑았습니다.");
        }
      } catch (error) {
        console.error("대기표 확인 중 오류:", error);
      }
    };

    checkUserTicket();

    // 가게 이미지 가져오기
    const fetchStoreImages = async () => {
      try {
        const storeRef = doc(db, "store", storeCode);
        const storeDoc = await getDoc(storeRef);

        if (storeDoc.exists()) {
          const images = storeDoc.data().images || []; // images 배열 가져오기
          setStoreImages(images);
        }
      } catch (error) {
        console.error("가게 이미지 로드 실패:", error);
      }
    };

    const fetchStoreName = async () => {
      try {
        const storeRef = doc(db, "store", storeCode); // storeCode에 해당하는 문서 참조
        const storeDoc = await getDoc(storeRef); // 문서 가져오기

        if (storeDoc.exists()) {
          const storeData = storeDoc.data(); // 문서 데이터
          setStoreName(storeData.name || ""); // 가게 이름 설정
        } else {
          console.error("가게 문서를 찾을 수 없습니다.");
        }
      } catch (error) {
        console.error("가게 이름 가져오기 오류:", error);
      }
    };
    fetchStoreName(); // 가게 이름 가져오기 호출

    fetchStoreImages();
  }, [deviceId, storeCode]);

  // 대기표 생성 함수
  const createTicketWithSubCollection = async (storeCode) => {
    try {
      setLoading(true);

      // Firestore 트랜잭션 실행
      const nextNumber = await runTransaction(db, async (transaction) => {
        const storeRef = doc(db, "store", storeCode);

        // 현재 대기표 번호 가져오기
        const storeDoc = await transaction.get(storeRef);
        let nextNumber = 1; // 기본 대기표 번호
        if (storeDoc.exists()) {
          nextNumber = storeDoc.data().nextNumber + 1;
        }

        // 다음 대기표 번호 업데이트
        transaction.set(storeRef, { nextNumber }, { merge: true });

        // 사용자 정보 저장
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

        // 대기표 저장
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

      // 성공적으로 대기표 번호 저장
      setTicketNumber(nextNumber);
      setCanDrawTicket(false);
      console.log(`Ticket ${nextNumber} created for store ${storeCode}`);
    } catch (error) {
      console.error("Transaction failed: ", error);
    } finally {
      setLoading(false);
    }
  };

  // 인원 추가
  const increasePersonnel = () => {
    setPersonnel((prev) => prev + 1);
  };

  // 인원 감소 (최소 1명)
  const decreasePersonnel = () => {
    setPersonnel((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 1.3, // 눌렀을 때 크기를 작게 만듦
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1, // 버튼에서 손을 뗐을 때 원래 크기로 돌아옴
      useNativeDriver: true,
    }).start();
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
          <Image
            source={{ uri: item }}
            style={[styles.image, { width: width - 40 }]} // 화면 크기에 맞게 이미지 크기 설정
          />
        )}
        style={styles.flatList} // FlatList 전체 크기 제한
      />
      <View style={styles.nameContainer}>
        <Text style={styles.storeName}>{storeName || "가게 이름 없음"}</Text>
      </View>

      <Animated.View style={{ transform: [{ scale }] }}>
        <TouchableOpacity
          style={canDrawTicket ? styles.ticketButton : styles.noneTicketButton}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={() => createTicketWithSubCollection(storeCode)}
          activeOpacity={0.7}
          disabled={loading || !canDrawTicket} // 로딩 중이거나 이미 대기표를 뽑았다면 비활성화
        >
          <Text style={styles.ticketButtonText}>
            {loading
              ? "대기표 생성 중..."
              : "클릭"}
          </Text>
        </TouchableOpacity>
      </Animated.View>

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
              ? "아직 대기표를 뽑지 않았습니다"
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
    padding: 20,            // 추가 여백을 주어 화면에 여유를 둡니다
  },
  flatList: {
    maxHeight: 200, // FlatList 전체 높이 제한
    marginTop: 30,
  },
  nameContainer: {
    marginTop: 10,
    alignItems: "left", // 가로 축 중앙 정렬
  },
  storeName: {
    fontWeight: "bold",
    fontSize: 25,
    color: "#FFFFFF",
  },
  textContainer: {
    alignItems: "center", // 가로 축 중앙 정렬
    justifyContent: "center", // 세로 축 중앙 정렬
    width: "100%", // 부모 컨테이너에 맞게 너비 설정
    marginBottom: 20, // 아래 간격 추가
  },
  header: {
    marginTop: 30,
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
    marginBottom: 20,
    width: "100%", // 부모 요소 기준으로 중앙 정렬되도록 설정
  },
  button: {
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  counter: {
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
    width: 100, // 버튼의 가로 크기 (원형이므로 가로, 세로 크기를 동일하게 설정)
    height: 100, // 버튼의 세로 크기
    borderRadius: 50, // 원형으로 만들기 위해 반지름을 버튼 크기의 반으로 설정
    backgroundColor: "#6661D5", // 버튼 배경색 (원하는 색으로 변경 가능)
    justifyContent: "center", // 버튼 텍스트를 수직 중앙 정렬
    alignItems: "center", // 버튼 텍스트를 수평 중앙 정렬
    marginTop: 20, // 버튼 위에 간격 추가
  },
  ticketButtonText: {
    color: "#fff", // 텍스트 색상 (흰색으로 설정)
    fontSize: 18, // 텍스트 크기
    fontWeight: "bold", // 텍스트 두께
  },
  noneTicketButton: {
    width: 100, // 버튼의 가로 크기 (원형이므로 가로, 세로 크기를 동일하게 설정)
    height: 100, // 버튼의 세로 크기
    borderRadius: 50, // 원형으로 만들기 위해 반지름을 버튼 크기의 반으로 설정
    backgroundColor: "#EAEAEA", // 버튼 배경색 (원하는 색으로 변경 가능)
    justifyContent: "center", // 버튼 텍스트를 수직 중앙 정렬
    alignItems: "center", // 버튼 텍스트를 수평 중앙 정렬
    marginTop: 20, // 버튼 위에 간격 추가
  },
  text: {
    fontWeight: "bold",
    fontSize: 25,
    color: "#FFFFFF",
  }
});
