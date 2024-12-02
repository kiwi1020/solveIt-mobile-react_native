import React, { useState, useEffect, useRef  } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Platform } from "react-native";
import firebaseApp from "../../firebase/firebaseConfig";
import { getFirestore, collection, query, onSnapshot, runTransaction, doc  } from "firebase/firestore";
import { LinearGradient } from 'expo-linear-gradient';
import * as Notifications from "expo-notifications";
const db = getFirestore(firebaseApp);

// 푸시 알림 핸들러 설정
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function StoreTicketList({ deviceId }) {
  const [tickets, setTickets] = useState([]); // 대기표 데이터 상태 저장
  const [loading, setLoading] = useState(true); // 로딩 상태

  const [notification, setNotification] = useState(null);
  const notificationListener = useRef();
  const responseListener = useRef();

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

  useEffect(() => {
    
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
    
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log("푸시 알림 수신:", notification);
      setNotification(notification); // 알림을 상태에 저장
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log("푸시 알림 응답:", response);  // 알림 응답 여부 확인
      console.log(response);
    });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(notificationListener.current);
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>로딩 중...</Text>
      </View>
    );
  }

  const waitingTickets = tickets.filter((ticket) => ticket.state === "waiting");

  const handleCall = async(expoPushToken) => {
    if (!expoPushToken) {
      Alert.alert("푸시 토큰이 없습니다.");
      return;
    }

    const message = {
      to: expoPushToken,
      sound: "default",
      title: "테스트 알림",
      body: "Expo 환경에서 푸시 알림 전송 성공!",
      data: { additionalData: "테스트 데이터" },
    };

    try {
      const response = await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          Accept: "application/json",
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      const result = await response.json();
      console.log("푸시 알림 전송 성공:", result);
      Alert.alert("푸시 알림 전송 성공!");
    } catch (error) {
      console.error("푸시 알림 전송 실패:", error);
      Alert.alert("푸시 알림 전송 실패:", error.message);
    }
  };

  const handleCancel = async (ticketId, deviceId) => {
    try {
      const storeCode = deviceId;
      setLoading(true);

      await runTransaction(db, async (transaction) => {
        const ticketRef = doc(db, "store", storeCode, "tickets", ticketId);
        const userRef = doc(db, "users", ticketId);

        const ticketDoc = await transaction.get(ticketRef);
        if (!ticketDoc.exists()) {
          throw new Error("대기표가 존재하지 않습니다.");
        }

        const userDoc = await transaction.get(userRef);

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

      await runTransaction(db, async (transaction) => {
        const ticketRef = doc(db, "store", storeCode, "tickets", ticketId);

        const ticketDoc = await transaction.get(ticketRef);
        if (!ticketDoc.exists()) {
          throw new Error("대기표가 존재하지 않습니다.");
        }

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
    <LinearGradient 
      style={styles.container} 
      colors={['#BFC0D6', '#CBBCD8']}
      start={{ x: 0, y: 0 }} // 왼쪽에서 시작
      end={{ x: 0.5, y: 0 }} // 오른쪽에서 끝
>
    <View >
      <View style={styles.headerContainer}>
        <Text style={styles.header}>대기표 목록</Text>
        <Text style={styles.teamCount}>대기 팀 수: {waitingTickets.length}</Text>
      </View>
      {tickets.length > 0 ? (
        <FlatList
          data={tickets}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const isDisabled = item.state === "complete" || item.state === "cancel";

            return (
              <View style={styles.ticketItem}>
                <Text style={styles.ticketText}>번호: {item.number}</Text>
                <Text style={styles.ticketText}>인원: {item.personnel}명</Text>
                <Text style={styles.ticketText}>상태: {item.state}</Text>

                {!isDisabled ? (
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => handleCall(item.expoPushToken)}
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
                ) : (
                  <View style={styles.overlay}>
                    <Text style={styles.overlayText}>
                      {item.state === "complete" ? "완료된 항목" : "취소된 항목"}
                    </Text>
                  </View>
                )}
              </View>
            );
          }}
        />
      ) : (
        <Text style={styles.noTickets}>현재 대기표가 없습니다.</Text>
      )}
    </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
    position: "relative", // 오버레이를 덮는 데 필요
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
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  overlayText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
