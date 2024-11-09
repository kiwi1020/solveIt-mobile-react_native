import React from "react";
import styled from "styled-components";

const Container = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    `;

const StyledText = styled.Text`
    font-size:30px;
    `;

//메인 홈
export const Home = () => {
    return (
        <Container>
            <StyledText>Home</StyledText>
        </Container>
    )
}

//힌트
export const Hint = () => {
    return (
        <Container>
            <StyledText>Hint</StyledText>
        </Container>
    )
}

//인물 설명
export const Figure = () => {
    return (
        <Container>
            <StyledText>Figure</StyledText>
        </Container>
    )
}

//상황 설명 탭
export const Situation = () => {
    return (
        <Container>
            <StyledText>Situation</StyledText>
        </Container>
    )
}

//증거물 탭
export const Evidence = () => {
    return (
        <Container>
            <StyledText>Evidence</StyledText>
        </Container>
    )
}