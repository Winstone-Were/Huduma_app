import React, { useState, useEffect } from 'react'

import { Alert, StyleSheet, View } from 'react-native';
import { Text, TextInput, Button,} from 'react-native-paper';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import FirebaseConfig from '../firebaseConfig';
import AuthService from '../Services/authService';


export default function Login({ navigation }) {
  useEffect(() => {

    AsyncStorage.getItem("user")
      .then(result => {
        if (JSON.parse(result)) {
          LocalAuthentication.authenticateAsync({ promptMessage: "Scan your Biometrics to continue" })
            .then(result => {
              if (result.success) {
                const userDetails = JSON.parse(result);
                // Navigate based on user role
                if (userDetails.role === 'customer') {
                  navigation.push('CustomerHomepage');
                } else if (userDetails.role === 'worker') {
                  navigation.push('WorkerHomepage');
              }
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
    try {
      const userDetails = await AuthService.Login(email, password, navigation);

      // Store user details in AsyncStorage
      await AsyncStorage.setItem('UserDetails', JSON.stringify(userDetails));

      // Navigate based on user role
      if (userDetails.role === 'customer') {
        navigation.push('CustomerHomepage');
      } else if (userDetails.role === 'worker') {
        navigation.push('WorkerHomepage');
      }
    } catch (err) {
      Alert.alert('Login failed', 'An error occurred during login.');
      console.error(err);
    }
  };

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