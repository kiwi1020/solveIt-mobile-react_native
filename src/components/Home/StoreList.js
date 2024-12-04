import React, { useEffect, useState} from "react";
import styled from "styled-components";
import { useNavigation } from "@react-navigation/native";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getApps, initializeApp } from "firebase/app";
import { firebaseConfig } from "../../firebase/firebaseConfig";
import { ScrollView, Image } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text} from "react-native";

const StoreList = ({ route }) => {
  const navigation = useNavigation();
  const [stores, setStores] = useState([]);
  const {deviceId, expoPushToken} = route.params;

  let app;
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  const db = getFirestore(app);

  const fetchStores = async () => {
    try {
      const storeCollection = collection(db, "store");
      const querySnapshot = await getDocs(storeCollection);
      const storeData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStores(storeData);
    } catch (error) {
      console.error("가게 목록을 가져오는 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const navigateToDetail = (storeCode, deviceId, expoPushToken) => {
    navigation.navigate("StoreDetail", {
      storeCode: storeCode,
      deviceId: deviceId,
      expoPushToken: expoPushToken,
    });
  };

  return (
    <LinearGradient
      style={styles.container}
      colors={['#BFC0D6', '#CBBCD8']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.5, y: 0 }}
    >
      <ScrollView>
        {stores.map((store) => (
          <StoreCard
            key={store.id}
            onPress={() => store.storeStatus !== 'closed' && navigateToDetail(store.storeCode, deviceId, expoPushToken)}
            style={[
              store.storeStatus === 'closed' && styles.overlay 
            ]}
          >
            <StoreName>{store.name}</StoreName>
            {store.storeStatus === 'closed' && (
                <Text style={styles.overlayText}>가게 오픈 준비중입니다!</Text>
              )}
            <ImageContainer>
              <Image
                source={{ uri: store.images?.[0] }}
                style={{
                  width: 100, 
                  height: 80, 
                  borderRadius: 20,
                }}
                resizeMode="contain" 
              />
              
            </ImageContainer>
          </StoreCard>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}
  

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    flex: 1,
    


  
},
overlay: {
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


const Container = styled.View`
  flex: 1;
  padding: 20px;
  background-color: #f9f9f9;
`;

const StoreCard = styled.TouchableOpacity`
  background-color: #fff;
  padding: 15px;

  border-radius: 20px;
  border-width: 2px;
  border-color: #9C92E9;
  width: 95%;
  margin-top: 3%;
  margin-left: 3%;
  height: 95;
  elevation: 3;
  flex-direction: row; /* 가로로 배치 */
  justify-content: space-between; /* 왼쪽 텍스트, 오른쪽 이미지 배치 */
  align-items: center; /* 세로 중앙 정렬 */
  shadow-color: #0000000;
  shadow-opacity: 1;
  shadow-radius: 4px;
  shadow-offset: 0px 1px;
`;

const StoreName = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #000000;
  flex: 1; /* 텍스트가 이미지의 왼쪽에 위치하도록 flex 설정 */
`;

const ImageContainer = styled.View`
  width: 100px; /* 이미지의 크기 제한 */
  height: 80px; /* 이미지의 크기 제한 */
  margin-left: 10px; /* 이미지와 텍스트 사이의 간격 */
`;
export default StoreList;
