import React, { useState, useEffect } from 'react'

import { Alert, StyleSheet, View } from 'react-native';
import { Text, TextInput, Button, Switch, HelperText, Menu, Divider } from 'react-native-paper';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';

export default function Login({navigation}) {

  //Check whether there's something in AsyncStorage
  //kama iko, weka Finger print 

  useEffect(()=>{

    AsyncStorage.getItem("UserDetails")
    .then(result=>{
      if(JSON.parse(result)){
        Alert.alert("Storage on");
        LocalAuthentication.authenticateAsync({promptMessage:"Scan your Biometrics to continue"})
        .then(result=>{
            if(result.success){
              navigation.push('HomeScreen');
            }
        })
        .catch(err=>{
            console.error(err);
        })
      }else {
        Alert.alert("Storage off");
      }
    })
    .catch(err=>{
      Alert.alert("Storage of")
      console.error(err);
    })

  },[]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  //const dispatch = useDispatch();

  const handleLogIn = async () => {
    //Try login 
    axios.post('http://192.168.100.99:3000/api/login',{email, password})
    .then(response=>{
      //set to async storage
      AsyncStorage.setItem('UserDetails',JSON.stringify(response));
      //push to profile
      navigation.push('HomeScreen');
    }).catch(err=>{
      //somehow alert the user there's an error
      console.error(Object.keys(err));
    })
  }

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text>
          Login to your Account
        </Text>
      </View>
      <TextInput
        style={{ ...styles.input, backgroundColor: "white" }}
        value={email}
        label='email'
        onChangeText={(text) => setEmail(text)}
      />

      <TextInput
        style={{ ...styles.input, backgroundColor: "white" }}
        value={password}
        label='password'
        onChangeText={(text) => setPassword(text)}
        secureTextEntry={true}
      />
     
      <Button mode='contained' style={styles.input} onPress={() => handleLogIn()} > Login </Button>
      <Button style={styles.input} onPress={() => navigation.push('RegisterScreen')}> Register </Button>
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