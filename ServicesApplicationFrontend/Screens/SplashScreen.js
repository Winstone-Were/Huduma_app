import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import LottieView from 'lottie-react-native';

const SplashScreen = ({ navigation }) => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShowSplash(false);
      navigation.push('LoginScreen'); // navigate to LoginScreen after 30 seconds
    }, 30000); // show splash screen for 30 seconds
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
      {showSplash && (
        <View>
          <Text style={{ fontSize: 36, color: '#000000', fontWeight: 'bold', marginBottom: 40, textAlign: 'center' }}>
            Welcome to Huduma
          </Text>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <LottieView
              source={require('../assets/animations/worker-customer.json')}
              autoPlay
              loop
              style={{ width: 200, height: 200, marginBottom: 20 }}
            />
            <TouchableOpacity onPress={() => navigation.push('LoginScreen')}>
              <Text style={{ fontSize: 18, color: '#4CAF50', fontWeight: 'bold' }}>
                Proceed
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default SplashScreen;