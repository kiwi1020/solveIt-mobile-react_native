import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigation } from "@react-navigation/native";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getApps, initializeApp } from "firebase/app";
import { firebaseConfig } from "../../firebase/firebaseConfig";
import { ScrollView, Image } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from "react-native";

const Container = styled.View`
  flex: 1;
  padding: 20px;
  background-color: #f9f9f9;
`;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    flex: 1,
    padding: "20",
    
}});
const StoreCard = styled.TouchableOpacity`
  background-color: #fff;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 8px;
  elevation: 3;
  flex-direction: row; /* 가로로 배치 */
  justify-content: space-between; /* 왼쪽 텍스트, 오른쪽 이미지 배치 */
  align-items: center; /* 세로 중앙 정렬 */
`;

const StoreName = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #333;
  flex: 1; /* 텍스트가 이미지의 왼쪽에 위치하도록 flex 설정 */
`;

const ImageContainer = styled.View`
  width: 100px; /* 이미지의 크기 제한 */
  height: 80px; /* 이미지의 크기 제한 */
  margin-left: 10px; /* 이미지와 텍스트 사이의 간격 */
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
        id: doc.id,
        ...doc.data(),
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
    navigation.navigate("StoreDetail", {
      storeCode: storeCode,
      deviceId: deviceId,
    });
  };

  return (
    // <Container>
      <LinearGradient 
      style={styles.container} 
      colors={['#BFC0D6', '#CBBCD8']}
      start={{ x: 0, y: 0 }} // 왼쪽에서 시작
      end={{ x: 0.5, y: 0 }} // 오른쪽에서 끝
>
      {/* 전체 화면을 ScrollView로 감싸기 */}
      <ScrollView>
        {stores.map((store) => (
          <StoreCard key={store.id} onPress={() => navigateToDetail(store.storeCode, deviceId)}>
            <StoreName>{store.name}</StoreName>

            {/* 첫 번째 이미지만 오른쪽에 배치 */}
            <ImageContainer>
              <Image
                source={{ uri: store.images?.[0] }}
                style={{
                  width: 100, // 크기 조정
                  height: 80, // 크기 조정
                  borderRadius: 20,
                }}
                resizeMode="contain" // 이미지가 잘리지 않도록 설정
              />
            </ImageContainer>
          </StoreCard>
        ))}
      </ScrollView>
      </LinearGradient>
    // </Container>
  );
};

export default StoreList;
