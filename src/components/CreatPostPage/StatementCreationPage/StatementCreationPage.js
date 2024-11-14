//진술 작성 페이지

import React, { useState } from "react";
import styled from "styled-components";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Input = styled.TextInput`
  border: 1px solid #ccc;
  padding: 10px;
  width: 80%;
  margin-bottom: 20px;
`;

const Button = styled.TouchableOpacity`
  background-color: #4CAF50;
  padding: 10px 20px;
  border-radius: 5px;
`;

const ButtonText = styled.Text`
  color: white;
`;

const StatementCreationPage = () => {
  const [caseName, setCaseName] = useState("");

  const handleSave = () => {
    // 입력 값을 저장하거나 업데이트하는 로직 작성
    console.log("진술 입력:", caseName);
  };

  return (
    <Container>
      <Input
        placeholder="진술 입력"
        value={caseName}
        onChangeText={(text) => setCaseName(text)}
      />
      <Button onPress={handleSave}>
        <ButtonText>저장</ButtonText>
      </Button>
    </Container>
  );
};

export default StatementCreationPage;
