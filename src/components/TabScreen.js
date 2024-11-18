import React, { useState } from "react";
import styled from "styled-components";
import StoreList from "./Home/StoreList";
import Mainn from "./Main";

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
      <StoreList/>
    </Container>
  );
};

//상황 설명 탭
export const Main = () => {
  return (
    <Container>
      <Mainn/>   
    </Container>
  );
};

//증거물 탭
export const Number = () => {
  return (
    <Container>
      <StyledText>번호표</StyledText>
    </Container>
  );
};
