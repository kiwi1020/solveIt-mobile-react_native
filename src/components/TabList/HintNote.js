//힌트 목록을 보여주는 탭
import React from "react";
import styled from "styled-components";

const NoteContainer = styled.View`
    padding: 20px;
    margin: 10px;
    background-color: #f0f0f0;
    border-radius: 8px;
`;

const NoteText = styled.Text`
    font-size: 18px;
    color: #333;
`;

const HintNote = ({ text  }) => {
    return (
        <NoteContainer>
            <NoteText>{text}</NoteText>
        </NoteContainer>
    );
};

export default HintNote;