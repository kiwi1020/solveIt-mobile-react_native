import React from 'react';
import { TouchableOpacity, Text} from 'react-native';



const EventButton = () =>{
    const _onPressIn = () => console.log('Press In !!!\n');
    const _onPressOut = () => console.log('Press Out !!!\n');
    const _onPress = () => console.log('Press !!!\n');
    const _onLongPress = () => console.log('Long Press !!!\n');


    return ( 
        <TouchableOpacity
        style = {{
            backgroundColor: '#3498db',
            padding: 16,
            margin: 10,
            borderRadius: 8
        }}
    
        onPressIn={_onPressIn}
        onLongPress={_onLongPress}
        onPressOut={_onPressOut}
        onPress={_onPress}
        delayLongPress={3000}
        >

        
        
            <Text 
            style = {{
                color: 'white', 
                fontSize: 24
            }}>
               EventPress
                </Text>
        </TouchableOpacity>

        //props와 state 시험 문제로 나옴
    );

};



export default EventButton;