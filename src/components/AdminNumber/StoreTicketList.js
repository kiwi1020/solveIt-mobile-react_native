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

//대기표 목록 관리 컴포넌트
export default function StoreTicketList({ deviceId }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true); 

  const [notification, setNotification] = useState(null);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    const storeCode = deviceId;
    const ticketsRef = collection(db, "store", storeCode, "tickets"); 
    const q = query(ticketsRef);
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const ticketList = [];
        querySnapshot.forEach((doc) => {
          ticketList.push({ id: doc.id, ...doc.data() });
        });
        setTickets(ticketList); 
        setLoading(false);
      },
      (error) => {
        console.error("Failed to fetch tickets: ", error);
      }
    );
    
    return () => unsubscribe(); 
  }, [deviceId]);

  // 푸시 알림 리스너 등록 
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
      setNotification(notification); 
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log("푸시 알림 응답:", response);  
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

  // 대기표 호출 함수
  const handleCall = async(expoPushToken) => {
    if (!expoPushToken) {
      Alert.alert("푸시 토큰이 없습니다.");
      return;
    }

    const message = {
      to: expoPushToken,
      sound: "default",
      title: "테스트 알림",
      body: "대기표가 호출 되었습니다!",
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

  // 대기표 취소 함수
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

  // 대기표 처리 완료 함수
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
      start={{ x: 0, y: 0 }} 
      end={{ x: 0.5, y: 0 }} 
    >
      <View style={styles.content}>
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
                  <Text style={styles.ticketText}>번호: {item.number} / 인원: {item.personnel}명 / 상태: {item.state}</Text>
                  {!isDisabled ? (
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity
                        style={[styles.button, styles.callButton]}
                        onPress={() => handleCall(item.expoPushToken)}
                      >
                        <Text style={styles.buttonText}>호출</Text>
                      </TouchableOpacity>
  
                      <TouchableOpacity
                        style={[styles.button, styles.completeButton]}
                        onPress={() => handleComplete(item.id, deviceId)}
                      >
                        <Text style={styles.buttonText}>완료</Text>
                      </TouchableOpacity>
  
                      <TouchableOpacity
                        style={[styles.button, styles.cancelButton]}
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
    paddingTop: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    width: "90%",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
    alignItems: "center",
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
  teamCount: {
    fontSize: 16,
    color: "#fff",
    fontStyle: "italic",
  },
  ticketItem: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    position: "relative", // 오버레이를 덮는 데 필요
  },
  ticketText: {
    fontSize: 16,
    color: "#6661D5",
    marginBottom: 5,
    fontWeight: "bold"
  },
  noTickets: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    marginTop: 30,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    width: "100%",
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  callButton: {
    backgroundColor: "#fff", 
  },
  completeButton: {
    backgroundColor: "#fff", 
  },
  cancelButton: {
    backgroundColor: "#fff", 
  },
  buttonText: {
    color: "#6661D5",
    fontSize: 14,
    fontWeight: "bold",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  overlayText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});