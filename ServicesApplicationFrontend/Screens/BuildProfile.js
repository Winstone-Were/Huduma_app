import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useRef } from 'react';
import { Alert, StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, Switch, HelperText, Menu, Divider, ActivityIndicator } from 'react-native-paper';

import axios from 'axios';
import { app, auth } from '../firebaseConfig';
import { signInWithPhoneNumber } from 'firebase/auth';
import VerifyPhone from './VerifyPhone';
import { DatePickerModal } from 'react-native-paper-dates';
import { STORAGE, AUTH, FIRESTORE_DB } from '../firebaseConfig';
import {addDoc, collection, setDoc, doc, getDoc} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';

import * as ImagePicker from 'expo-image-picker';

export default function BuildProfile({ navigation }) {

  const [uid, setUID] = useState('');
  const [username, setUserName] = useState('');
  const [phone_number, setPhone_number] = useState('+254');
  const [imageURL, setImageURL] = useState('');
  const [email, setEmail] = useState('');
  const [waitVerify, setWaitVerify] = useState(true);
  const [loading, setLoading] = useState(true);
  const [confirmationResult, setConfirmationResult] = useState('');
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [image, setImage] = useState();
  const [date, setDate] = useState();
  const [open, setOpen] = useState(false);


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

            axios.post('http://192.168.100.91:3000/api/buildprofile', { uid, username, phone_number, email })

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


  /*const handleRegister = () => {
    signInWithPhoneNumber(auth, phone_number, recaptchaVerifier.current)
      .then(result => {
        console.log(result);
        setLoading(!loading);
        setConfirmationResult(result);
      }).catch(err => {
        console.error(err);
      })
  }
*/

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

  const getUploadPath = async () => {
    try {
      const UserObject = await AsyncStorage.getItem('user');
      const user = JSON.parse(UserObject);
      return `profilePhotos/${user.user.uid}`;
    } catch (err) {
      console.error(err);
    }
  }

  const getPhotoURL = async () => {
    try{
      const refPath = await getUploadPath();
      const pathReference = ref(STORAGE, refPath);
      const URL = await getDownloadURL(pathReference);
      setImageURL(URL);
      return URL;
    } catch (err) { 
      console.error(err);
    }
  }

  const pickImage = async () => {
    let result = ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
      base64: true
    });

    setImage((await result).assets[0].uri);
    getPhotoURL();

  }


  const onDismissSingle = React.useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirmSingle = React.useCallback(
    (params) => {
      setOpen(false);
      setDate(params.date);
    },
    [setOpen, setDate]
  );

  const uploadImage = async () => {
    if (image == null) {
      return null;
    }
    const uploadUri = image;
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

    // Add timestamp to File Name
    const extension = filename.split('.').pop();
    const name = filename.split('.').slice(0, -1).join('.');
    filename = name + Date.now() + '.' + extension;
    console.log(filename);

    const path = await getUploadPath();
    const profilePhotoStorage = ref(STORAGE, `${path}`);

    const metadata = {
      contentType : 'image/jpeg'
    }

    fetch(image)
      .then((resp) => {
        resp.blob().then(res => {
          uploadBytes(profilePhotoStorage, res, metadata)
            .then((snap) => {
              console.log('uploaded profile photo')
            })
            .catch((err) => {
              console.error(err);
            })
        })
      })
  }

  const writeUserToFirestore = async () => {
    try{
      const UserObject = await AsyncStorage.getItem('user');
      const user = JSON.parse(UserObject);
      let uid = user.user.uid;
      setDoc(doc(FIRESTORE_DB, 'Users', uid),{username, phone_number, date,}, {merge:true});
    }catch (err) {
      console.error(err)
    }
  }

  const updateUserProfile = async () => {
    console.log(AUTH.currentUser);
    updateProfile(AUTH.currentUser, {
      displayName: username, photoURL: imageURL, 
    }).then((res)=>{
      uploadImage();
      writeUserToFirestore();
      console.log(res)
    }).catch((err)=>{
      console.error(err);
    })
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
            label='Full Name'
            onChangeText={(text) => setUserName(text)}
          />
          <TextInput
            style={{ ...styles.input, backgroundColor: "white" }}
            value={phone_number}
            label='Phone Number'
            onChangeText={(text) => setPhone_number(text)}
          />
          <TouchableOpacity onPress={() => setOpen(true)}>
            {date ?
              (<>
                <Text style={{ fontSize: 20 }}>
                  D.O.B  {date.toString()}
                </Text>
              </>) :
              (<>
                <Text style={{ fontSize: 20, }}>
                  Dob
                </Text>
              </>)}

          </TouchableOpacity>
          <DatePickerModal
            locale="en"
            mode="single"
            visible={open}
            onDismiss={onDismissSingle}
            date={date}
            onConfirm={onConfirmSingle}
          />

          <Button mode='elevated' style={styles.input} onPress={() => pickImage()}> Select Image </Button>

          <Button mode='contained' style={styles.input} onPress={() => updateUserProfile()}> Send Verification </Button>
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


    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "", marginHorizontal: 10 },
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