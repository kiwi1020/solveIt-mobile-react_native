//게시글 작성 네비게이터

// PostCreationStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import PostCreationPage from './PostCreationPage';
import CaseNameCreationPage from './CaseNameCreationPage/CaseNameCreationPage';
import EvidenceCreationPage from './EvidenceCreationPage/EvidenceCreationPage';
import FigureCreationPage from './FigureCreationPage/FigureCreationPage';
import StatementInput from './StatementCreationPage/StatementCreationPage';
import SituationCreationPage from './SituationCreationPage/SituationCreationPage';
import AnswerCreationPage from './AnswerCreationPage/AnswerCreationPage';
import HintCreationPage from './HintCreationPage/HintCreationPage';

const Stack = createStackNavigator();

const PostCreationStack = () => (
  <Stack.Navigator initialRouteName="PostCreationPage">
    <Stack.Screen name="PostCreationPage" component={PostCreationPage} options={{ title: '게시글 작성' }} />
    <Stack.Screen name="CaseNameCreationPage" component={CaseNameCreationPage} options={{ title: '사건 이름 입력' }} />
    <Stack.Screen name="EvidenceCreationPage" component={EvidenceCreationPage} options={{ title: '증거물 입력' }} />
    <Stack.Screen name="FigureCreationPage" component={FigureCreationPage} options={{ title: '인물 설명 입력' }} />
    <Stack.Screen name="StatementInput" component={StatementInput} options={{ title: '진술 입력' }} />
    <Stack.Screen name="SituationCreatPage" component={SituationCreationPage} options={{ title: '상황 설명 입력' }} />
    <Stack.Screen name="AnswerCreationPage" component={AnswerCreationPage} options={{ title: '정답 입력' }} />
    <Stack.Screen name="HintCreationPage" component={HintCreationPage} options={{ title: '힌트 입력' }} />
  </Stack.Navigator>
);

export default PostCreationStack;
