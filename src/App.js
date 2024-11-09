
import React, {useState}from 'react';
import styled,{ ThemeProvider } from 'styled-components/native';
import { theme } from './theme';
import { StatusBar } from 'expo-status-bar';
import Input from './components/Input';
import IconButton from './components/IconButton';
import { images } from './images';
  // const Container = styled.View`

  //자동으로 padding 값이 적용되어 노치 디자인 문제를 해결 할 수 있는 SafeAreaView
  const Container = styled.SafeAreaView`

  flex:1;
  background-color: ${({theme}) => theme.background};
  align-items: center;
  justify-content: center;
  `;

const Title = styled.Text`
fon-size: 40px;
font-weight:600;
color: ${({theme}) => theme.main};
  align-items: flex-start;
  margin: 0px 20px;

`;

export default function App() {
  const [newTask, setNewTask] = useState('');

  const _addTask = () => {
    alert(`Add: ${newTask}`);
    setNewTask('');
  };

  const _handleTextChange = text => {
    setNewTask(text);
  };
  
  return(
    <ThemeProvider theme={theme}>
  
  
    <Container>
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.background}
        />
      <Title>TODO List</Title>
      <Input 
      placeholder = "+ ADD a Tesk"
      value={newTask}
      onChangeText = {_handleTextChange}
      onSubmitEditing={_addTask}
      />
    <IconButton type= {images.uncompleted} />
    <IconButton type= {images.completed} />
    <IconButton type= {images.delete} />
    <IconButton type= {images.update} />

    </Container>
    </ThemeProvider>
  );

}
