import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Button, FlatList, Image, Dimensions } from "react-native";
import firebaseApp from "../../firebase/firebaseConfig";
import { getFirestore, doc, getDoc, collection } from "firebase/firestore";
import { runTransaction } from "firebase/firestore";
import { LinearGradient } from 'expo-linear-gradient';


const db = getFirestore(firebaseApp);

export default function StoreDetail({ route }) {
  const [ticketNumber, setTicketNumber] = useState(null); // 대기표 번호 저장
  const [personnel, setPersonnel] = useState(1); // 기본 인원 수 (최소 1명)
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [canDrawTicket, setCanDrawTicket] = useState(true); // 대기표 뽑기 가능 여부
  const [storeImages, setStoreImages] = useState([]); // 가게 이미지 배열 저장
  const { storeCode, deviceId, expoPushToken } = route.params; // storeCode는 가게 UUID이고 deviceId는 사용자 UUID임
  const [storeName, setStoreName] = useState(""); // 가게 이름 상태

  // 화면의 크기를 얻어 슬라이드 이미지 크기 설정
  const { width } = Dimensions.get('window');

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
        transaction.set(userRef, {
          storeCode,
          number: nextNumber,
          state: "waiting",
          personnel: personnel,
          expoPushToken: expoPushToken,
        }, { merge: true });

        // 대기표 저장
        const ticketRef = doc(collection(db, "store", storeCode, "tickets"), deviceId);
        transaction.set(ticketRef, {
          number: nextNumber,
          state: "waiting",
          personnel: personnel,
          expoPushToken: expoPushToken
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

  return (
    <LinearGradient 
      style={styles.container} 
      colors={['#BFC0D6', '#CBBCD8']}
      start={{ x: 0, y: 0 }} // 왼쪽에서 시작
      end={{ x: 0.5, y: 0 }} // 오른쪽에서 끝
>
    <View >
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

      <Text style={styles.storeName}>{storeName}</Text>

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

      <Button
        title={loading ? "대기표 생성 중..." : canDrawTicket ? "대기표 뽑기" : "이미 대기표를 뽑았습니다"}
        onPress={() => createTicketWithSubCollection(storeCode)}
        disabled={loading || !canDrawTicket} // 로딩 중이거나 이미 대기표를 뽑았다면 비활성화
      />
      {ticketNumber && (
        <Text style={styles.ticketInfo}>
          당신의 대기표 번호는 {ticketNumber}번입니다.
        </Text>
      )}
    </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    
    backgroundColor: "#6661D5",
  },
  flatList: {
    maxHeight: 200, // FlatList 전체 높이 제한
    
    marginTop: 30,
  },
  nameContainer:{
    marginTop: 10,
    alignItems: "left", // 가로 축 중앙 정렬
    marginLeft: 30,

  },
  storeName:{
    fontWeight: "bold",
    fontSize: 25,
    color: '#FFFFFF'
  },
  textContainer: {
    alignItems: "center", // 가로 축 중앙 정렬
    justifyContent: "center", // 세로 축 중앙 정렬
    width: '100%', // 부모 컨테이너에 맞게 너비 설정
    marginBottom: 20, // 아래 간격 추가
  },
  header: {
    marginTop:30,
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
    width: '100%', // 부모 요소 기준으로 중앙 정렬되도록 설정
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
  
});
