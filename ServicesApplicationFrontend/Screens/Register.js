import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, ActivityIndicator, Portal, Modal, Menu, SegmentedButtons, Appbar } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword } from 'firebase/auth';
import { addDoc, collection, setDoc, doc, getDoc } from 'firebase/firestore'
import Firebase from '../firebaseConfig';
import { FIRESTORE_DB } from '../firebaseConfig'
import { IosAlertStyle } from 'expo-notifications';

const PasswordModal = ({ visible, hideModal }) => {
  const containerStyle = { backgroundColor: 'white', padding: 20, margin: 20 };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
        <Text style={{ marginBottom: 10, fontWeight: 'bold' }}>Password Guidelines:</Text>
        <Text>1. At least 8 characters long</Text>
        <Text>2. Contains an uppercase letter</Text>
        <Text>3. Contains a lowercase letter</Text>
        <Text>4. Contains a number</Text>
        <Text>5. Contains a special character (e.g., !@#$%^&*)</Text>
        <Button onPress={hideModal} style={{ marginTop: 20 }}>Close</Button>
      </Modal>
    </Portal>
  );
};

export default function Register({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('client'); // default value is client
  const [accountCreated, setAccountCreated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    if (accountCreated) {
      setLoading(false);
    } else {
      if (password !== confirmPassword) {
        Alert.alert('Passwords need to match');
        setLoading(false);//to not show loading sign
      } else {
        createUserWithEmailAndPassword(Firebase.auth, email, password)
          .then((userCredential) => {
            sendEmailVerification(Firebase.auth.currentUser)
              .then(() => {
                let uid = userCredential.user.uid;
                console.log(role);
                setDoc(doc(FIRESTORE_DB, 'Users', uid), { role }, {merge:true})
                  .then(()=>{
                    Alert.alert("Verification Email sent, Click the link in your email address to verify your account");
                  }).catch((err)=>{
                    console.error(err);
                  })
                setLoading(false);
              })
              .catch((error) => {
                console.error(error)
                Alert.alert('Another Error');
                setLoading(false);
              })
          })
          .catch((error) => {
            console.error(error);
            Alert.alert('Email Already Used');
            setLoading(false);
          });
      }
    }
  };

  const handleRegisterNext = async () => {
    //Login place creds in localStorage then push to Home Screen based on role
    setLoading(true);
    signInWithEmailAndPassword(FirebaseConfig.auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials;
        AsyncStorage.setItem('user', JSON.stringify(user));
        AsyncStorage.setItem('user-login-object', JSON.stringify({ email, password }));
        const DocRef = doc(FIRESTORE_DB, "Users", user.user.uid);
        getDoc(DocRef)
          .then(data => {
            let user_role = data.data().role;
            if (user_role == 'client') {
              navigation.replace('CustomerHomepage')
            } else if (user_role == 'worker') {
              navigation.replace('WorkerHomepage')
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

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Create an account" />
      </Appbar.Header>
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator animating={true} />
        ) : (
          <>

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
              onFocus={showModal}
            />
            <TextInput
              style={{ ...styles.input, backgroundColor: "white" }}
              value={confirmPassword}
              label='confirm password'
              onChangeText={(text) => setConfirmPassword(text)}
              secureTextEntry={true}
            />

            <SegmentedButtons
              value={role}
              onValueChange={setRole}
              buttons={
                [
                  {
                    value: 'client',
                    label: 'I want help'
                  },
                  {
                    value: 'worker',
                    label: 'I want to work'
                  }
                ]
              }
            />
            <Button mode='contained' style={styles.input} onPress={handleRegister}> Send Email Verification </Button>
          </>
        )}
        {accountCreated ?
          <Button style={styles.input} mode='elevated' onPress={() => handleRegisterNext()}> Next </Button> : <></>}

        <PasswordModal visible={modalVisible} hideModal={hideModal} />
      </View>
      <View style={styles.row}>
        <Text style={styles.Information}>
          Already have an account ? 
        </Text>
        <TouchableOpacity onPress={()=> navigation.replace("LoginScreen")}>
            <Text style={styles.textLink}> 
              Login Here
            </Text>
        </TouchableOpacity>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, marginHorizontal: 20, marginTop: 40 },
  input: { marginVertical: 5, borderRadius: 0 },
  row: {
    alignItems: "center",
    flexDirection: "row",
    marginVertical: 20,
  },
  textContainer: { alignContent: 'center', alignItems: 'center' },
  Information: {
    color: 'purple',
    fontSize: 15,
  },
  textLink: {
    color:'orange',
    marginLeft:2
  }
});
