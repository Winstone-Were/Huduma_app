import React, { useState, useEffect } from 'eact';
import { View, Image, TouchableOpacity, Text } from 'eact-native';
import Login from './Login';

const SplashScreen = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShowSplash(false);
    }, 3000); // show splash screen for 3 seconds
  }, []);

  const proceed = () => {
    setShowSplash(false);
    // navigate to main app screen
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {showSplash && (
        <Image
          source={require('./logo.png')}
          style={{ width: 200, height: 200, marginBottom: 20 }}
        />
      )}
      {showSplash && (
        <TouchableOpacity onPress={Login}>
          <Text style={{ fontSize: 18, color: '#4CAF50' }}>Proceed</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SplashScreen;