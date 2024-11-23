import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import firebaseApp from "../../firebase/firebaseConfig";
import { getFirestore, doc, getDoc, updateDoc, writeBatch} from "firebase/firestore";

const db = getFirestore(firebaseApp);

export default function MyTicket({ deviceId }) {
  const [myTicketNumber, setMyTicketNumber] = useState(null); // 내가 뽑은 번호
  const [personnel, setPersonnel] = useState(null); // 인원 수
  const [state, setState] = useState(null); // 상태
  const [loading, setLoading] = useState(true); // 로딩 상태

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        // users/{deviceId}에서 대기표 정보 가져오기
        const userRef = doc(db, "users", deviceId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          // 대기표 정보 저장
          setMyTicketNumber(userData.number); 
          setPersonnel(userData.personnel); 
          setState(userData.state); 
          console.log("내 대기표 번호:", userData.number); 
          console.log("인원 수:", userData.personnel); 
          console.log("상태:", userData.state);
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
  
        // 트랜잭션을 사용하여 두 문서를 동시에 업데이트
        const batch = writeBatch(db);
        
        // users/{deviceId}에서 상태를 "cancel"로 업데이트
        batch.update(userRef, { state: "cancel" });
        
        // store/{storeCode}/tickets/{deviceId}에서 상태를 "cancel"로 업데이트
        batch.update(ticketRef, { state: "cancel" });
  
        // 배치 실행
        await batch.commit();
  
        // 로컬 상태 업데이트
        setState("cancel");
        console.log("대기표 취소 완료");
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
    <View style={styles.container}>
      {myTicketNumber ? (
        <>
          <Text style={styles.text}>내 대기표 번호: {myTicketNumber}</Text>
          <Text style={styles.text}>인원 수: {personnel}명</Text>
          <Text style={styles.text}>상태: {state}</Text>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#6661D5",
  },
  text: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "#6661D5",
    fontSize: 16,
    fontWeight: "bold",
  },
});
