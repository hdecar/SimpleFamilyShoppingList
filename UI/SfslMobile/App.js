import React, {useState} from 'react';
import { StyleSheet, Text, View, Button, TextInput, ScrollView } from 'react-native';

export default function App() {
  const [outputText, setOutputText] = useState('');
  const [listText, setListText] = useState([]);

const changeTextHandler = (text) =>{
  setOutputText(text);
}

const addListItemHandler = () => {
  setListText(currentList => [...listText, outputText]);
  setOutputText('');
}

  return (
    <View>
      <View style={styles.titleView}>
        <Text style={styles.titleText}>Simple Family Shopping List</Text>
      </View>
      <View style={styles.mainContainer}>
        <View style={styles.inputView}>
          <TextInput 
            style={styles.textInput} 
            placeholder="Enter item here"
            onChangeText={changeTextHandler}
            value={outputText}
          ></TextInput>        
          <Button style={styles.button} title="Add" onPress={addListItemHandler} />
        </View>
        <ScrollView>
          {listText.map((item) => <View key={item} style={styles.listItem}><Text>{item}</Text></View>)}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    paddingLeft: 30,
    paddingRight: 30
  },
  titleView: {
    backgroundColor: 'yellow',
    marginTop: 50
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'center'
  },
  inputView: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    height: 100
  },
  textInput: {
    borderColor: '#999',
    borderWidth: 1,
    padding: 5,
    width: '80%'
  },
  button: {
    backgroundColor: 'blue'
  },
  listItem: {
    padding: 5,
    borderColor: 'black',
    borderWidth: 1
  }
});
