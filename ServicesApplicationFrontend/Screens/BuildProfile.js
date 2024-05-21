import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useRef } from 'react';
import { Alert, StyleSheet, View, Image } from 'react-native';
import { Text, TextInput, Button, Switch, HelperText, Menu, Divider, ActivityIndicator } from 'react-native-paper';
import axios from 'axios';
import { app, auth } from '../firebaseConfig';
import { signInWithPhoneNumber } from 'firebase/auth';
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import VerifyPhone from './VerifyPhone';

import * as ImagePicker from 'expo-image-picker';

export default function BuildProfile({ navigation }) {

  const [uid, setUID] = useState('');
  const [username, setUserName] = useState('');
  const [phone_number, setPhone_number] = useState('');
  const [email, setEmail] = useState('');
  const [waitVerify, setWaitVerify] = useState(true);
  const [loading, setLoading] = useState(true);
  const [confirmationResult, setConfirmationResult] = useState('');
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [image, setImage] = useState();
  const [image64, setImage64] = useState();

  const recaptchaVerifier = useRef(null);


  const verifyCode = async (code) => {
    setVerifyLoading(true);
    if (confirmationResult) {
      try {
        const userCredential = await confirmationResult.confirm(code);
        console.log('Verified');
        //send request to build profile
        //push to homepage
        AsyncStorage.getItem('UserDetails')
          .then(UserDetails => {
            let UserObject = JSON.parse(UserDetails);
            console.log(Object.keys(UserObject.data.userCredential.user))
            setUID(UserObject.data.userCredential.user.uid);
            setEmail(UserObject.data.userCredential.user.email);


            //Send this request after SMS verification
            axios.post('http://172.20.10.13:3000/api/buildprofile', { uid, username, phone_number, email, image64 })
              .then(response => {
                //go to build profile
                //store details in async storage
                navigation.push('HomeScreen');
              }).catch(err => {
                //somehow alert the user there's an error
                console.error(err);
              })

          })
          .catch(err => {
            console.error(err);
          })
      } catch (error) {
        setVerifyLoading(false);
        console.error(error);
        setVerificationWrong(true);
      }
    } else {
    }
  };


  const handleRegister = () => {
    signInWithPhoneNumber(auth, phone_number, recaptchaVerifier.current)
      .then(result => {
        console.log(result);
        setLoading(!loading);
        setConfirmationResult(result);
      }).catch(err => {
        console.error(err);
      })
  }


  const handleNext = async () => {

    // fetch uuid and email from AsyncStorage
    setLoading(true);
    setWaitVerify(!waitVerify);
    signInWithPhoneNumber(auth, phone_number, recaptchaVerifier.current)
      .then(result => {
        setWaitVerify(true);
        setConfirmationResult(result);
      })
      .catch(err => {
        console.error(err);
      })
    /*AsyncStorage.getItem('UserDetails')
      .then(UserDetails => {
        let UserObject = JSON.parse(UserDetails);
        console.log(Object.keys(UserObject.data.userCredential.user))
        setUID(UserObject.data.userCredential.user.uid);
        setEmail(UserObject.data.userCredential.user.email);


        //Send this request after SMS verification
        axios.post('http://192.168.100.140:3000/api/buildprofile', { uid, username, phone_number, email })
          .then(response => {
            //go to build profile
            //store details in async storage
            navigation.push('HomeScreen');
          }).catch(err => {
            //somehow alert the user there's an error
            console.error(err);
          })

      })
      .catch(err => {
        console.error(err);
      }) */
  }

  const pickImage = async () => {
    let result = ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true
    });

    console.log((await result).assets[0].base64);
    setImage64((await result).assets[0].base64);
    setImage((await result).assets[0].uri);

  }

  return (
    <View style={styles.container}>
      {loading ?
        (<>
          <View style={styles.textContainer}>
            <Text>
              Tell us about Yourself
            </Text>
          </View>

          {image && <Image source={{ uri: image }} style={styles.image} />}

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

          <Button mode='elevated' style={styles.input} onPress={() => pickImage()}> Select Image </Button>

          <Button mode='contained' style={styles.input} onPress={() => handleRegister()} > Send Verification </Button>
        </>) :
        (<>
          {verifyLoading ?
            (<>
              <ActivityIndicator animating={true} />
            </>) :
            (<>
              <VerifyPhone
                onVerify={verifyCode}
                onVerificationRetry={() => {
                  setConfirmationResult(null);
                  setVerificationWrong(false);
                  setIsVerifying(false);
                }}
              />
            </>)}

        </>)}
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={app.options}
      />

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
  textContainer: { alignContent: 'center', alignItems: 'center' },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignSelf: "center"
  },

});