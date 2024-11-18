// 버튼 두개 있는 메인 
import React from "react";
import styled from "styled-components";
import { useNavigation } from '@react-navigation/native';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Button = styled.TouchableOpacity`
  background-color: #6661D5;
  padding: 15px 30px;
  border-margin: 5px;
  margin: 10px;
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 32px;
`;

const Main = () => {
  const navigation = useNavigation();

  // 화면 이름("StoreDetail")을 문자열로 전달
  const navigateToList = () => {
    navigation.navigate("홈", {
      screen: "StoreList", // "홈" 탭 안의 StoreList로 이동
    });
  };

  const navigateToNumber = () => {
    navigation.navigate("TicketUser");
  };

  return (
    <Container>
      <Button onPress={navigateToList}>
        <ButtonText>일반 사용자</ButtonText>
      </Button>
      <Button onPress={navigateToNumber}>
        <ButtonText>업체 관리자</ButtonText>
      </Button>
    </Container>
  );
};

export default Main;
