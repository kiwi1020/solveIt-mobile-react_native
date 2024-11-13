//작성 페이지들을 보여주는 페이지

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
  margin: 10px;
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 16px;
`;

const PostCreationPage = () => {
  const navigation = useNavigation();

  const navigateToInputPage = (pageName) => {
    navigation.navigate(pageName);
  };

  return (
    <Container>
      <Button onPress={() => navigateToInputPage("CaseNameCreationPage")}>
        <ButtonText>사건 이름 입력</ButtonText>
      </Button>
      <Button onPress={() => navigateToInputPage("EvidenceCreationPage")}>
        <ButtonText>증거물 입력</ButtonText>
      </Button>
      <Button onPress={() => navigateToInputPage("FigureCreationPage")}>
        <ButtonText>인물 설명 입력</ButtonText>
      </Button>
      <Button onPress={() => navigateToInputPage("StatementInput")}>
        <ButtonText>진술 입력</ButtonText>
      </Button>
      <Button onPress={() => navigateToInputPage("SituationCreationPage")}>
        <ButtonText>상황 설명 입력</ButtonText>
      </Button>
      <Button onPress={() => navigateToInputPage("AnswerCreationPage")}>
        <ButtonText>정답 입력</ButtonText>
      </Button>
      <Button onPress={() => navigateToInputPage("HintCreationPage")}>
        <ButtonText>힌트 입력</ButtonText>
      </Button>
    </Container>
  );
};

export default PostCreationPage;
