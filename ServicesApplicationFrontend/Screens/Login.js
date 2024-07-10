import React, { useState, useEffect } from 'react'

import { Alert, StyleSheet, View } from 'react-native';
import { Text, TextInput, Button, ActivityIndicator } from 'react-native-paper';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import FirebaseConfig, { AUTH } from '../firebaseConfig';
import { signInWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { addDoc, collection, setDoc, doc, getDoc, getDocs } from 'firebase/firestore'
import { FIRESTORE_DB } from '../firebaseConfig';

import {writeToCustomerState, writeToWorkerState} from '../Services/stateService'

export default function Login({ navigation }) {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    AsyncStorage.getItem("user-login-object")
      .then(result => {
        user = JSON.parse(result);
        console.log(user);
        if (user.email != "") {
          LocalAuthentication.authenticateAsync({ promptMessage: "Scan your Biometrics to continue" })
            .then(biometrics => {
              if (biometrics.success) {
                setLoading(true);
                signInWithEmailAndPassword(FirebaseConfig.auth, user.email, user.password)
                  .then((userCredentials) => {
                    const user = userCredentials;
                    AsyncStorage.setItem('user', JSON.stringify(user))
                    AsyncStorage.setItem('user-login-object', JSON.stringify({ email, password }));
                    const DocRef = doc(FIRESTORE_DB, "Users", user.user.uid);
                    getDoc(DocRef)
                      .then(data => {
                        let user_role = data.data().role;
                        if (user_role == 'client') {
                          writeToCustomerState(data.data())
                          navigation.replace('CustomerHomepage')
                        } else if (user_role == 'worker') {
                          console.log(data.data())
                          if(!data.data().approved && AUTH.currentUser.displayName){
                            navigation.push("NotApprovedScreen");
                          }else{
                            if(!data.data().ban){
                              writeToWorkerState(data.data());
                              navigation.push("WorkerHomepage");
                            }else{
                              navigation.push("BanScreen");
                            }
                          }
                        }
                      })
                      .catch(err => {
                        console.error(err);
                        setLoading(false);
                      })
                  })
                  .catch((error) => {
                    setLoading(false);
                    console.log(error.code + " : " + error.message);
                  })
              }
            })
            .catch(err => {
              console.error(err);
            })
        } else {

        }
      })
      .catch(err => {
        console.error(err);
      })

  }, []);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const handleLogIn = async () => {
    //login user 
    setLoading(true);
    signInWithEmailAndPassword(FirebaseConfig.auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials;
        AsyncStorage.setItem('user', JSON.stringify(user));
        AsyncStorage.setItem('user-login-object', JSON.stringify({ email, password }));
        const DocRef = doc(FIRESTORE_DB, "Users", user.user.uid);
        getDoc(DocRef)
          .then(data => {
            AsyncStorage.setItem('specific-user-object', JSON.stringify(data.data()));
            let user_role = data.data().role;
            if (user_role == 'client') {
              writeToCustomerState(data.data());
              navigation.replace('CustomerHomepage')
            } else if (user_role == 'worker') {
              if(!data.data().approved && AUTH.currentUser.displayName){
                navigation.push("NotApprovedScreen");
              }else{
                if(!data.data().ban){
                  writeToWorkerState(data.data());
                  navigation.push("WorkerHomepage");
                }else{
                  navigation.push("BanScreen");
                }
              }
            }
          })
          .catch(err => {
            setLoading(false);
            console.error(err)
          })

      })
      .catch((error) => {
        setLoading(false);
        console.log(error.code + " : " + error.message);
      })
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text>
          Login to your Account
        </Text>
      </View>
      {loading ?
        (
          <>
            <ActivityIndicator animating={true} />
          </>) :
        (<>
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
        </>)}

        <Button onPress={()=> navigation.push('ForgotPassword')}> Forgot Password </Button>


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