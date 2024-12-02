import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import firebaseApp from "../../firebase/firebaseConfig";
import { getFirestore, doc, getDoc, updateDoc, writeBatch, deleteDoc } from "firebase/firestore";
import { LinearGradient } from 'expo-linear-gradient';

const db = getFirestore(firebaseApp);

export default function MyTicket({ deviceId }) {
  const [myTicketNumber, setMyTicketNumber] = useState(null); // 내가 뽑은 번호
  const [personnel, setPersonnel] = useState(null); // 인원 수
  const [state, setState] = useState(null); // 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [storeName, setStoreName] = useState(""); // 가게 이름 상태

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        // users/{deviceId}에서 대기표 정보 가져오기
        const userRef = doc(db, "users", deviceId);
        const userDoc = await getDoc(userRef);
  
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setMyTicketNumber(userData.number); 
          setPersonnel(userData.personnel); 
          setState(userData.state);
  
          // 가게 이름 가져오기
          const storeRef = doc(db, "store", userData.storeCode);
          const storeDoc = await getDoc(storeRef);
  
          if (storeDoc.exists()) {
            setStoreName(storeDoc.data().name); // 가게 이름 상태 업데이트
          } else {
            console.log("가게 정보를 찾을 수 없습니다.");
          }
        } else {
          console.log("내 대기표가 없습니다.");
          setMyTicketNumber(null);
          setPersonnel(null);
          setState(null);
        }
      } catch (error) {
        console.error("Failed to fetch ticket:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchTicket();
  }, [deviceId]);

  const cancelTicket = async () => {
    try {
      // users/{deviceId}에서 대기표 정보 가져오기
      const userRef = doc(db, "users", deviceId);
      const userDoc = await getDoc(userRef);
  
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const storeCode = userData.storeCode; // storeCode가 users 문서에 저장되어 있다고 가정
      
        // store/{storeCode}/tickets/{deviceId}에서 상태를 "cancel"로 업데이트
        const ticketRef = doc(db, "store", storeCode, "tickets", deviceId);
  
        // 트랜잭션을 사용하여 두 문서를 동시에 업데이트 및 삭제
        const batch = writeBatch(db);
        
        // users/{deviceId}에서 상태를 "cancel"로 업데이트
        batch.update(userRef, { state: "cancel" });
        
        // store/{storeCode}/tickets/{deviceId}에서 상태를 "cancel"로 업데이트
        batch.update(ticketRef, { state: "cancel" });

        // Firestore 배치 업데이트 후 users/{deviceId} 문서 삭제
        await batch.commit();
        await deleteDoc(userRef); // 문서 삭제

        // 로컬 상태 업데이트
        setMyTicketNumber(null); // 번호표 제거
        setPersonnel(null); // 인원 수 초기화
        setState(null); // 상태 초기화
        console.log("대기표 취소 및 사용자 문서 삭제 완료");
      } else {
        console.log("사용자 정보가 없습니다.");
      }
    } catch (error) {
      console.error("Failed to cancel ticket:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>로딩 중...</Text>
      </View>
    );
  }

  return (
    <LinearGradient 
      style={styles.container} 
      colors={['#BFC0D6', '#CBBCD8']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.5, y: 0 }}
    >
      <View style={styles.ticketContainer}>
        {myTicketNumber ? (
          <>
            {/* 영수증 스타일 */}
            <View style={styles.receipt}>
              <Text style={styles.storeName}>{storeName}</Text> {/* 가게 이름 표시 */}
              <Text style={styles.ticketHeader}>대기표</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>번호:</Text>
                <Text style={styles.infoValue}>{myTicketNumber}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>인원:</Text>
                <Text style={styles.infoValue}>{personnel}명</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>상태:</Text>
                <Text style={styles.infoValue}>{state}</Text>
              </View>
            </View>

            {/* 취소 버튼 */}
            {state !== "cancel" && (
              <TouchableOpacity style={styles.button} onPress={cancelTicket}>
                <Text style={styles.buttonText}>취소</Text>
              </TouchableOpacity>
            )}
          </>
        ) : (
          <Text style={styles.text}>현재 대기표가 없습니다.</Text>
        )}
      </View>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  storeName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#666",
    textAlign: "center",
    marginBottom: 10, // 아래 간격
  },
  ticketContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  receipt: {
    backgroundColor: "#fff", // 흰색 배경
    padding: 20,
    borderRadius: 10,
    borderColor: "#ccc", // 테두리 색상
    borderWidth: 1,
    width: 300, // 영수증 너비
    elevation: 5, // 그림자 효과
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  ticketHeader: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#333",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  infoLabel: {
    fontSize: 18,
    color: "#555",
  },
  infoValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#6661D5",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  text: {
    fontSize: 18,
    color: "#fff",
  },
});