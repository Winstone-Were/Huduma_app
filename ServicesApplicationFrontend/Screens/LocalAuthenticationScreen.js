import { View, Text } from 'react-native'
import React, { useEffect } from 'react'

import * as LocalAuthentication from 'expo-local-authentication';

export default function LocalAuthenticationScreen() {
    useEffect(()=>{
        LocalAuthentication.authenticateAsync({promptMessage:"Scan your Biometrics to continue"})
            .then(result=>{
                console.log(result);
            })
            .catch(err=>{
                console.error(err);
            })
    },[]);
  return (
    <View>
      <Text>LocalAuthentication</Text>
    </View>
  )
}