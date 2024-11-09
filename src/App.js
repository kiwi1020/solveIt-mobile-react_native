import React from 'react';


// 탭 네비게이션
import { NavigationContainer } from '@react-navigation/native';
import TabNavigation from './components/Tab';



export default function App() {
 

  return (
      <NavigationContainer>
          
          <TabNavigation />
      </NavigationContainer>
  );
}
