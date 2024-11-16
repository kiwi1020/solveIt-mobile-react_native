import React, { useState } from "react";
import styled from "styled-components";


const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const StyledText = styled.Text`
  font-size: 30px;
`;


//메인 홈
export const Home = () => {
  return (
    <Container>
      <StyledText>Home</StyledText>
    </Container>
  );
};

//상황 설명 탭
export const Main = () => {
  return (
    <Container>
      <StyledText>Situation</StyledText>
    </Container>
  );
};

//증거물 탭
export const Number = () => {
  return (
    <Container>
      <StyledText>Evidence</StyledText>
    </Container>
  );
};
