import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Text, TextInput, Button, Switch, HelperText, Menu, Divider } from 'react-native-paper';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home({navigation}) {


  useEffect(()=>{
    AsyncStorage.getAllKeys()
    .then(data=> console.log(data))
  },[]);

  const handleLogOut = async ()=>{
    AsyncStorage.clear()
    Alert.alert("You've been logged out");
    navigation.push('LoginScreen');
  }

  const clearStorage = async () => {
    AsyncStorage.clear();
    navigation.push("LoginScreen");
  }

  const readStorage = async () => {
    AsyncStorage.getItem("UserDetails")
    .then(result=>{
      if(JSON.parse(result)){
        Alert.alert("Storage on")
      }else {
        Alert.alert("Storage off");
      }
    })
    .catch(err=>{
      Alert.alert("Storage of")
      console.error(err);
    })
  } 


  return (
    <View style={styles.container}>
      <Button onPress={()=> handleLogOut()}> LOG OUT  </Button>
      <Button onPress={()=> clearStorage()}>CLEAR STORAGE </Button>
      <Button onPress={()=> readStorage()}> SHOW STORAGE </Button>
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