//넘버 - 사용자 번호표
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, TouchableOpacity } from "react-native";
import firebaseApp from "../../firebase/firebaseConfig";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";

const db = getFirestore(firebaseApp);

export default function MyTicket({ deviceId, storecode = "store123" }) {
  const [myTicketNumber, setMyTicketNumber] = useState(null); // 내가 뽑은 번호
  const [personnel, setPersonnel] = useState(null); // 인원 수
  const [state, setState] = useState(null); // 상태
  const [loading, setLoading] = useState(true); // 로딩 상태

  useEffect(() => {
    const TicketUser = async () => {
      try {
        const ticketRef = doc(db, "store", storecode, "tickets", `${deviceId}`);
        const ticketDoc = await getDoc(ticketRef);

        if (ticketDoc.exists()) {
          const ticketData = ticketDoc.data();
          setMyTicketNumber(ticketData.number); // 번호표 저장
          setPersonnel(ticketData.personnel); // 인원 수 저장
          setState(ticketData.state); // 상태 저장
          console.log("내 대기표 번호:", ticketData.number); // 추후 지울 것
          console.log("인원 수:", ticketData.personnel); // 추후 지울 것
          console.log("상태:", ticketData.state); // 추후 지울 것
        } else {
          console.log("내 대기표가 없습니다."); // 추후 지울 것
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

    TicketUser();
  }, [deviceId, storecode]);

  const cancelTicket = async () => {
    try {
      const ticketRef = doc(db, "store", storecode, "tickets", `${deviceId}`);
      await updateDoc(ticketRef, { state: "cancel" }); // Firestore에서 state를 "cancel"로 업데이트
      setState("cancel"); // 로컬 상태 업데이트
      console.log("대기표 취소 완료"); // 추후 지울 것
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
