import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Text, TextInput, Button, ActivityIndicator, Portal, Modal } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const [accountCreated, setAccountCreated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const handleRegister = async () => {
      //Call /api/register
    //Email verify 
    //Login user by placing user tokens in AsyncStorage
    setLoading(true);
    if (accountCreated) {
      setLoading(false);
    } else {
      if (password !== confirmPassword) {
        Alert.alert('Passwords need to match');
        setLoading(false);//to not show loading sign
      } else {
        axios.post('http://192.168.100.99:3000/api/register', { email, password })
          .then(response => {
            //tell user to approve account via email
            //try to logIn
            console.log(response);
            setAccountCreated(!accountCreated);
            setLoading(false);
          }).catch(err => {
             //somehow alert the user there's an error
            console.error(err);
            setLoading(false);
          });
      }
    }
  };

  const handleRegisterNext = async () => {
    //try to logIn
    axios.post('http://192.168.100.99:3000/api/login', { email, password })
      .then(response => {
         //go to build profile
        //store details in async storage
        AsyncStorage.setItem('UserDetails', JSON.stringify(response));
        navigation.push('BuildProfileScreen');
      }).catch(err => {
        //somehow alert the user there's an error
        console.error(err);
      });
  };

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

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
              onFocus={showModal}
            />
            
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
