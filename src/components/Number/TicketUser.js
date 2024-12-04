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
        const userRef = doc(db, "users", deviceId);
        const userDoc = await getDoc(userRef);
  
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setMyTicketNumber(userData.number); 
          setPersonnel(userData.personnel); 
          setState(userData.state);
  
          const storeRef = doc(db, "store", userData.storeCode);
          const storeDoc = await getDoc(storeRef);
  
          if (storeDoc.exists()) {
            setStoreName(storeDoc.data().name);
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
      const userRef = doc(db, "users", deviceId);
      const userDoc = await getDoc(userRef);
  
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const storeCode = userData.storeCode; 
        const ticketRef = doc(db, "store", storeCode, "tickets", deviceId);
        const batch = writeBatch(db);
        
        batch.update(userRef, { state: "cancel" });
        batch.update(ticketRef, { state: "cancel" });

        await batch.commit();
        await deleteDoc(userRef); 

        setMyTicketNumber(null); 
        setPersonnel(null); 
        setState(null); 
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
            
            <View style={styles.receipt}>
              <Text style={styles.storeName}>{storeName}</Text> 
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