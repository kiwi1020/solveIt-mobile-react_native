//게시글 목록을 보여주고, 게시글 작성 하는 버튼을 보여주는 탭

import React from "react";
import styled from "styled-components";
import { useNavigation } from '@react-navigation/native';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Button = styled.TouchableOpacity`
  background-color: #4CAF50;
  padding: 15px 30px;
  border-radius: 5px;
  margin: 20px;
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 16px;
`;

const HomeTab = () => {
  const navigation = useNavigation();

  const handleNewPost = () => {
    navigation.navigate("PostCreationPage");
  };

  return (
    <Container>
      <Button onPress={handleNewPost}>
        <ButtonText>게시글 작성</ButtonText>
      </Button>
    </Container>
  );
};

export default HomeTab;

