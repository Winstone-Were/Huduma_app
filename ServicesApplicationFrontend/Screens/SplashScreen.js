import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';

const SplashScreen = ({navigation}) => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShowSplash(false);
    }, 4000); // show splash screen for 3 seconds
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {showSplash && (
        <Image
          source={require('../assets/logo.png')}
          style={{ width: 200, height: 200, marginBottom: 20 }}
        />
      )}
      {showSplash && (
        <TouchableOpacity onPress={()=> {navigation.push("LoginScreen")}}>
          <Text style={{ fontSize: 18, color: '#4CAF50' }}>Proceed</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SplashScreen;