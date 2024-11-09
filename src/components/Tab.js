import React from 'react';
//탭 기능
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Hint, Home, Figure, Situation, Evidence  } from './TabScreen';

const Tab = createBottomTabNavigator();

const TabNavigation = () =>{
return (
<Tab.Navigator>
      <Tab.Screen name='Home' component={Home} />
      <Tab.Screen name='Hint' component={Hint} />
      <Tab.Screen name='figure' component={Figure} />
      <Tab.Screen name='evidence' component={Evidence} />
      <Tab.Screen name='Situation' component={Situation} />

    </Tab.Navigator>

);
};

export default TabNavigation;