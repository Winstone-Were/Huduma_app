import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react'

import { Alert, StyleSheet, View } from 'react-native';
import { Text, TextInput, Button, ActivityIndicator, } from 'react-native-paper';
import { Appbar, List, Switch } from 'react-native-paper';
import { updatePassword } from 'firebase/auth';
import * as LocalAuthentication from 'expo-local-authentication';

import { AUTH } from '../../firebaseConfig';

export default function ChangePassword({ navigation }) {

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const updateUserPassword = async () => {
    setLoading(true);
    let userLoginObject = await AsyncStorage.getItem('user-login-object');
    let userLogin = JSON.parse(userLoginObject);
    try {
      let userLoginObject = await AsyncStorage.getItem('user-login-object');
      let userLogin = JSON.parse(userLoginObject);
      console.log(userLogin);

      if (userLogin.password == oldPassword) {
        if (newPassword == confirmPassword) {
          LocalAuthentication.authenticateAsync({ promptMessage: "Scan your Biometrics to continue" })
            .then(biometrics => {
              if (biometrics.success) {
                updatePassword(AUTH.currentUser, newPassword)
                  .then(() => {
                    Alert.alert('Password Changed');
                    setLoading(false);
                  })
                  .catch(() => {
                    Alert.alert('Could not change Password');
                    setLoading(false);
                  })
              }
            })
        } else {
          setLoading(false);
          Alert.alert("Confirm your new password");
        }
      } else {
        setLoading(false);
        console.log(userLogin.password);
        Alert.alert("Old password does not match entered password");
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }

  }

  return (
    <View>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Change Password" />
      </Appbar.Header>
      {loading ?
        (<>
          <ActivityIndicator animating={true} />
        </>) :
        (<>
          <View>
            <TextInput
              style={{ ...styles.input, backgroundColor: "white" }}
              value={oldPassword}
              label='Old Password'
              onChangeText={(text) => setOldPassword(text)}
              secureTextEntry={true}

            />

            <TextInput
              style={{ ...styles.input, backgroundColor: "white" }}
              value={newPassword}
              label='New Password'
              onChangeText={(text) => setNewPassword(text)}
              secureTextEntry={true}

            />

            <TextInput
              style={{ ...styles.input, backgroundColor: "white" }}
              value={confirmPassword}
              label='Confirm Password'
              onChangeText={(text) => setConfirmPassword(text)}
              secureTextEntry={true}

            />

            <Button mode='contained' onPress={() => updateUserPassword()}> Change Password  </Button>
            <Button onPress={() => navigation.push('ForgotPassword')}> Forgot Password </Button>

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