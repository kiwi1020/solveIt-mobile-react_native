import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigation } from "@react-navigation/native";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getApps, initializeApp } from "firebase/app"; 
import { firebaseConfig } from "../../firebase/firebaseConfig";

const Container = styled.View`
  flex: 1;
  padding: 20px;
  background-color: #f9f9f9;
`;

const StoreCard = styled.TouchableOpacity`
  background-color: #fff;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 8px;
  elevation: 3;
`;

const StoreName = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #333;
`;

const StoreList = ({ route }) => {
  const navigation = useNavigation();
  const [stores, setStores] = useState([]);
  const deviceId = route.params.deviceId;

  // Firebase 앱 초기화
  let app;
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  const db = getFirestore(app);

  // Firestore에서 가게 데이터 가져오기
  const fetchStores = async () => {
    try {
      const storeCollection = collection(db, "store");
      const querySnapshot = await getDocs(storeCollection);
      const storeData = querySnapshot.docs.map((doc) => ({
        id: doc.id, // 문서 ID
        ...doc.data(), // 데이터 필드
      }));
      setStores(storeData); // state에 데이터 저장
    } catch (error) {
      console.error("가게 목록을 가져오는 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const navigateToDetail = (storeCode, deviceId) => { 
    navigation.navigate('StoreDetail', {
      storeCode: storeCode,
      deviceId:  deviceId, 
    })}

  return (
    <Container>
      {stores.map((store) => (
        <StoreCard key={store.id} onPress={() => navigateToDetail(store.storeCode, deviceId)}>
          <StoreName>{store.name}</StoreName>
        </StoreCard>
      ))}
    </Container>
  );
};

export default StoreList;
