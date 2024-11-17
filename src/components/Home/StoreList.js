//홈 - 가게 목록

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
  width: 100%;
  margin: 10px;
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 32px;
`;

const StoreList = () => {
  const navigation = useNavigation();

  // 화면 이름("StoreDetail")을 문자열로 전달
  const navigateToDetail = () => {
    navigation.navigate("StoreDetail");
  };

  return (
    <Container>
      <Button onPress={navigateToDetail}>
        <ButtonText>가게</ButtonText>
      </Button>
    </Container>
  );
};

export default StoreList;
