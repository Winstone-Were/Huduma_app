import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Text, TextInput, Button, ActivityIndicator, Portal, Modal, Menu } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword } from 'firebase/auth';
import {addDoc, collection, setDoc, doc, getDoc} from 'firebase/firestore'
import Firebase from '../firebaseConfig';
import {FIRESTORE_DB} from '../firebaseConfig'


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
          .then((userCredential)=>{
            sendEmailVerification(Firebase.auth.currentUser)
              .then(()=>{
                let uid = userCredential.user.uid;
                setDoc(doc(FIRESTORE_DB, 'Users', uid), {role});
                Alert.alert("Verification Email sent, Click the link in your email address to verify your account");
              })
            .catch((error)=>{
              console.error(error)
              Alert.alert('Another Error');
            })
          })
          .catch((error)=> {
            console.error(error);
            Alert.alert('Email Already Used');
            setLoading(false);
          });
      }
    }
  };

  const handleRegisterNext = async () => {
    //Login place creds in localStorage then push to Home Screen based on role
    signInWithEmailAndPassword(Firebase.auth, email, password)
      .then((userCredentials)=>{
        const user = userCredentials;
        AsyncStorage.setItem('user', JSON.stringify(userCredentials));
        AsyncStorage.setItem('user-login-object', JSON.parse({email,password,role}));
        //push to HomeScreenBasedOnRole
        //load a bit, check whats in fireStore then push based on that
        console.log(user);
      })
  };

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  return (
    //+paperprovider to maintai
    
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text>Create An Account</Text>
        </View>
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

            <Menu
              visible={menuVisible}
              onDismiss={closeMenu}
              anchor={
                <Button onPress={openMenu} mode="outlined">
                  Select Role: {role}
                </Button>
              }
            >
              <Menu.Item onPress={() => { setRole('client'); closeMenu(); }} title="client" />
              <Menu.Item onPress={() => { setRole('worker'); closeMenu(); }} title="Worker" />
            </Menu>

            <Button mode='contained' style={styles.input} onPress={handleRegister}> Send Email Verification </Button>
            <Button style={styles.input} onPress={() => navigation.push('LoginScreen')}> Login </Button>
          </>
        )}
        {accountCreated ?
          <Button style={styles.input} mode='elevated' onPress={()=>handleRegisterNext()}> Next </Button> :<></>}
        
        <PasswordModal visible={modalVisible} hideModal={hideModal} />
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
  Information: {

    color: 'purple',
    fontSize: 15,

  }
});
