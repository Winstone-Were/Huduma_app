import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, TextInput, Button, Switch, HelperText, Menu, Divider } from 'react-native-paper';
import axios from 'axios';

export default function BuildProfile({navigation}) {

  const [uid, setUID] = useState('');
  const [username, setUserName] = useState('');
  const [phone_number, setPhone_number] = useState('');
  const [email, setEmail] = useState('');

  const handleNext = async()=> {
    // fetch uuid and email from AsyncStorage
    AsyncStorage.getItem('UserDetails')
      .then(UserDetails=>{
        let UserObject = JSON.parse(UserDetails);
        console.log(Object.keys(UserObject.data.userCredential.user))
        setUID(UserObject.data.userCredential.user.uid);
        setEmail(UserObject.data.userCredential.user.email);

        axios.post('http://192.168.100.140:3000/api/buildprofile', { uid, username , phone_number,email})
        .then(response => {
          //go to build profile
          //store details in async storage
          navigation.push('HomeScreen');
        }).catch(err => {
          //somehow alert the user there's an error
          console.error(err);
        })

      })
      .catch(err=>{
        console.error(err);
      })
  }

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text>
          Tell us about Yourself
        </Text>
      </View>
      <TextInput
        style={{ ...styles.input, backgroundColor: "white" }}
        value={username}
        label='Your name'
        onChangeText={(text) => setUserName(text)}
      />

      <TextInput
        style={{ ...styles.input, backgroundColor: "white" }}
        value={phone_number}
        label='Your phone number'
        onChangeText={(text) => setPhone_number(text)}
      />

      <Button mode='contained' style={styles.input} onPress={() => handleNext()} > Send Verification </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", marginHorizontal: 30 },
  input: { marginVertical: 5, borderRadius: 0 },
  row: {
    alignItems: "center",
    flexDirection: "row",
    marginVertical: 20,
    justifyContent: "space-between",
  },
  textContainer: { alignContent: 'center', alignItems: 'center' }

});