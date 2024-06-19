import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react'

import { Alert, StyleSheet, View } from 'react-native';
import { Text, TextInput, Button, ActivityIndicator, } from 'react-native-paper';
import { Appbar, List, Switch } from 'react-native-paper';
import { sendEmailVerification, updateEmail, verifyBeforeUpdateEmail } from 'firebase/auth';

import { AUTH } from '../../firebaseConfig';

export default function ChangeEmail({ navigation }) {

  const [emailAddress, setEmailAddress] = useState('');
  const [loading, setLoading] = useState(false);


  const updateUserEmail = async () => {
    setLoading(true);
    verifyBeforeUpdateEmail(AUTH.currentUser, emailAddress)
        .then(()=>{
            Alert.alert('Email changed');
        }).catch(err=> console.error);
    /*updateEmail(AUTH.currentUser, emailAddress)
        .then((resp)=>{
            console.error(resp)
        }).catch((err)=>{
            setLoading(false);
            console.error(err);
        })*/
  }

  return (
    <View>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Change Password" />
      </Appbar.Header>
      {loading ?
        (<>
          <ActivityIndicator animating={true}/>
          <Text> Check your email Address to verify </Text>
        </>) :
        (<>
          <View>
            <TextInput
              style={{ ...styles.input, backgroundColor: "white" }}
              value={emailAddress}
              label='Old Password'
              onChangeText={(text) => setEmailAddress(text)}

            />

            <Button mode='contained' onPress={() => updateUserEmail()}> Change Email  </Button>
            <Button onPress={()=> navigation.push('ForgotPassword')}> Forgot Password </Button>

          </View>
        </>)}

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