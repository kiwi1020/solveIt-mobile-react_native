import React, { useState } from "react";
import styled from "styled-components";
import HintNote from "./TabList/HintNote";
import { Hints } from "../static/Hints";
import { Figures } from "../static/Figures";
import HomeTab from "./TabList/HomeTab";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const StyledText = styled.Text`
  font-size: 30px;
`;

const StyledButtonText = styled.Text`
  font-size: 15px;
`;

const Button = styled.TouchableOpacity`
  background-color: #4CAF50;   
  padding: 15px 30px;          
  border-radius: 5px;           
  margin: 20px;            
`;

const ButtonContainer = styled.View`
  flex-direction: row;  
  justify-content: center;  
  position: absolute;
  bottom: 30px;  
`;

const CaseName = styled.Text`
  position: absolute;  
  top: 20px;
  left: 20px;
  font-size: 20px;
  font-weight: bold;
`;

//메인 홈
export const Home = () => {
  return (
    <Container>
      <StyledText>Home</StyledText>
      <HomeTab/>
    </Container>
  );
};

//힌트
export const Hint = () => {
  const [page, setPage] = useState(1);

   // 이전 버튼 클릭
   const handlePrevious = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  // 다음 버튼 클릭
  const handleNext = () => {
    if (page < 3) {
      setPage(page + 1);
    }
  };

  return (
    <Container>
    <StyledText>Hint{page}</StyledText>
    <HintNote text={Hints[page - 1]}/>
        <ButtonContainer> 
            <Button onPress={handlePrevious}>
                <StyledButtonText>이전</StyledButtonText>
            </Button>
            <Button onPress={handleNext}>
                <StyledButtonText>다음</StyledButtonText>
            </Button>
        </ButtonContainer>
    </Container>
  );
};

//인물 설명
export const Figure = () => {
    const [page, setPage] = useState(1);

   // 이전 버튼 클릭
    const handlePrevious = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  // 다음 버튼 클릭
  const handleNext = () => {
    if (page < 3) {
      setPage(page + 1);
    }
  };

  return (
    <Container>
      <StyledText>Figure{page}</StyledText>
    <HintNote text={Figures[page - 1]}/>
        <ButtonContainer> 
            <Button onPress={handlePrevious}>
                <StyledButtonText>이전</StyledButtonText>
            </Button>
            <Button onPress={handleNext}>
                <StyledButtonText>다음</StyledButtonText>
            </Button>
        </ButtonContainer>
    </Container>
  );
};

//상황 설명 탭
export const Situation = () => {
  return (
    <Container>
      <StyledText>Situation</StyledText>
    </Container>
  );
};

//증거물 탭
export const Evidence = () => {
  return (
    <Container>
      <StyledText>Evidence</StyledText>
    </Container>
  );
};
