import React,{useState} from 'react';
import { TextInput, Text, View} from 'react-native';


const EventInput= () =>{
    const[text,setText] = useState('');
    const _onChange = event => setText(event.nativeEvent.text);
    //ㄴ 입력된 텍스트가 변경될 때 호출


return(

    <View>
        <Text style={{ margin: 10, fontSize:30}}>text:{text}</Text>
        <TextInput
        style={{ borderWidth: 1, padding: 10, fontSize:20}}
        placeholder="Enter a text..."
        onChange={_onChange}
        />
    </View>


);
};


export default EventInput;