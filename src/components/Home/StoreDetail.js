//홈 - 가게 세부 정보

import React, { useState  } from "react";
import { Button, View, Text, StyleSheet, TouchableOpacity } from "react-native";// 파이어 베이스 쓰는법
import firebaseApp from "../../firebase/firebaseConfig";
import { getFirestore, collection, doc, runTransaction } from "firebase/firestore";

const db = getFirestore(firebaseApp);

export default function StoreDetail() {
    const [ticketNumber, setTicketNumber] = useState(null); // 대기표 번호 저장
    const [personnel, setPersonnel] = useState(1); // 기본 인원 수 (최소 1명)
    const [loading, setLoading] = useState(false); // 로딩 상태
  
    // 대기표 생성 함수 (하위 컬렉션 사용)
    const createTicketWithSubCollection = async (storecode, usercode) => {
      try {
        setLoading(true);
  
        // Firestore 트랜잭션 실행
        const nextNumber = await runTransaction(db, async (transaction) => {
          const storeRef = doc(db, "store", storecode); // storeTickets/가게ID
  
          // 현재 대기표 번호 가져오기
          const storeDoc = await transaction.get(storeRef);
          let nextNumber = 1; // 기본 대기표 번호
          if (storeDoc.exists()) {
            nextNumber = storeDoc.data().nextNumber + 1;
          }
  
          // 다음 대기표 번호 업데이트
          transaction.set(storeRef, { nextNumber });
  
          // **하위 컬렉션 경로**: storeTickets/{storeId}/tickets
          const ticketRef = doc(collection(db, "store", storecode, "tickets"), `ticket_${nextNumber}`);
          transaction.set(ticketRef, {
            usercode: usercode,
            number: nextNumber,
            state: "waiting",
            personnel: personnel,
          });
  
          return nextNumber; // 반환된 값으로 다음 번호 설정
        });
  
        // 성공적으로 대기표 번호 저장
        setTicketNumber(nextNumber);
        console.log(`Ticket ${nextNumber} created for store ${storecode}`);
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
      <View style={styles.container}>
        <Text style={styles.header}>대기표 뽑기</Text>
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
          title={loading ? "대기표 생성 중..." : "대기표 뽑기"}
          onPress={() => createTicketWithSubCollection("store123", "user001")} // 예제: store123, user001
          disabled={loading}
        />
        {ticketNumber && (
          <Text style={styles.ticketInfo}>
            당신의 대기표 번호는 {ticketNumber}번입니다.
          </Text>
        )}
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
        
        ...StyleSheet.absoluteFillObject, // 화면 전체를 채우도록 설정
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#6661D5",

    },
    header: {
      fontSize: 30,
      fontWeight: "bold",
      marginBottom: 20,
      color: "#fff"
    },
    counterContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
    },
    button: {
      padding: 10,
      borderRadius: 5,
      marginHorizontal: 10,
      color: "#fff"
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
  });