//업주 - 번호표 관리


import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import firebaseApp from "../../firebase/firebaseConfig";
import { getFirestore, collection, query, onSnapshot } from "firebase/firestore";

const db = getFirestore(firebaseApp);

export default function StoreTicketList() {
  const [tickets, setTickets] = useState([]); // 대기표 데이터 상태 저장
  const [loading, setLoading] = useState(true); // 로딩 상태

  useEffect(() => {
    // Firestore에서 하위 컬렉션 데이터 실시간 구독
    const storecode = "store123"; // 조회할 가게 ID
    const ticketsRef = collection(db, "store", storecode, "tickets"); // 하위 컬렉션 경로
    const q = query(ticketsRef);

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const ticketList = [];
        querySnapshot.forEach((doc) => {
          ticketList.push({ id: doc.id, ...doc.data() });
        });
        setTickets(ticketList); // 대기표 데이터 업데이트
        setLoading(false);
      },
      (error) => {
        console.error("Failed to fetch tickets: ", error);
      }
    );

    // 컴포넌트 언마운트 시 구독 해제
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>로딩 중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>대기표 목록</Text>
      {tickets.length > 0 ? (
        <FlatList
          data={tickets}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.ticketItem}>
              <Text style={styles.ticketText}>번호: {item.number}</Text>
              <Text style={styles.ticketText}>인원: {item.personnel}명</Text>
              <Text style={styles.ticketText}>상태: {item.state}</Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noTickets}>현재 대기표가 없습니다.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6661D5",
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
  },
  loadingText: {
    fontSize: 20,
    color: "#fff",
  },
  ticketItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: "90%",
    alignItems: "center",
  },
  ticketText: {
    fontSize: 16,
    color: "#333",
  },
  noTickets: {
    fontSize: 18,
    color: "#fff",
  },
});

