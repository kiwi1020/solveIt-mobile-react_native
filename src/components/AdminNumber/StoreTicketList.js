import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import firebaseApp from "../../firebase/firebaseConfig";
import { getFirestore, collection, query, onSnapshot, runTransaction, doc  } from "firebase/firestore";

const db = getFirestore(firebaseApp);

export default function StoreTicketList({ deviceId }) {
  const [tickets, setTickets] = useState([]); // 대기표 데이터 상태 저장
  const [loading, setLoading] = useState(true); // 로딩 상태

  useEffect(() => {
    const storeCode = deviceId;
    const ticketsRef = collection(db, "store", storeCode, "tickets"); // 하위 컬렉션 경로
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

    return () => unsubscribe(); // 컴포넌트 언마운트 시 구독 해제
  }, [deviceId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>로딩 중...</Text>
      </View>
    );
  }

  const waitingTickets = tickets.filter((ticket) => ticket.state === "waiting");

  const handleCall = (ticketId) => {
    // 호출 함수 (추후 구현)
    console.log(`Calling ticket ID: ${ticketId}`);
  };

  const handleCancel = async (ticketId, deviceId) => {
  try {
    const storeCode = deviceId;
    setLoading(true);

    // 트랜잭션에서 모든 읽기 작업이 완료된 후 쓰기 작업 수행
    await runTransaction(db, async (transaction) => {
      const ticketRef = doc(db, "store", storeCode, "tickets", ticketId); // 대기표 문서 참조
      const userRef = doc(db, "users", ticketId); // 사용자 문서 참조

      // 대기표 문서 읽기
      const ticketDoc = await transaction.get(ticketRef);
      if (!ticketDoc.exists()) {
        throw new Error("대기표가 존재하지 않습니다.");
      }

      // 사용자 문서 읽기
      const userDoc = await transaction.get(userRef);

      // 모든 읽기 작업 완료 후 쓰기 작업 수행
      transaction.update(ticketRef, {
        state: "cancel",
      });

      if (userDoc.exists()) {
        transaction.delete(userRef);
      } else {
        console.log(`User document with ID ${ticketId} does not exist.`);
      }
    });

    console.log(`Ticket ${ticketId} has been cancelled and user document deleted.`);
  } catch (error) {
    console.error("Error cancelling ticket: ", error);
  } finally {
    setLoading(false);
  }
};

const handleComplete = async (ticketId, deviceId) => {
  try {
    const storeCode = deviceId;
    setLoading(true);

    // Firestore 트랜잭션으로 상태값을 'complete'로 변경
    await runTransaction(db, async (transaction) => {
      const ticketRef = doc(db, "store", storeCode, "tickets", ticketId); // 대기표 문서 참조

      // 대기표 문서 읽기
      const ticketDoc = await transaction.get(ticketRef);
      if (!ticketDoc.exists()) {
        throw new Error("대기표가 존재하지 않습니다.");
      }

      // 상태값을 'complete'로 업데이트
      transaction.update(ticketRef, {
        state: "complete",
      });
    });

    console.log(`Ticket ${ticketId} has been marked as complete.`);
  } catch (error) {
    console.error("Error completing ticket: ", error);
  } finally {
    setLoading(false);
  }
};

  

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>대기표 목록</Text>
        <Text style={styles.teamCount}>대기 팀 수: {waitingTickets.length}</Text> 
      </View>
      {tickets.length > 0 ? (
        <FlatList
          data={tickets}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.ticketItem}>
              <Text style={styles.ticketText}>번호: {item.number}</Text>
              <Text style={styles.ticketText}>인원: {item.personnel}명</Text>
              <Text style={styles.ticketText}>상태: {item.state}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleCall(item.id)}
                >
                  <Text style={styles.buttonText}>호출</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleComplete(item.id, deviceId)}
                >
                  <Text style={styles.buttonText}>완료</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleCancel(item.id, deviceId)}
                >
                  <Text style={styles.buttonText}>취소</Text>
                </TouchableOpacity>
              </View>
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
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginBottom: 20,
    alignItems: "center",
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
  },
  teamCount: {
    fontSize: 16,
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
    width: "100%",
  },
  button: {
    backgroundColor: "#444",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});
