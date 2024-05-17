import React from 'react';
import {TouchableOpacity, Text, StyleSheet } from 'react-native';

const CustomButton = ({ onPress, title, color }) => {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: color || 'blue' }]}
      onPress={onPress}
    >
      <Text style={styles.text}>{title || 'Custom Button'}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
});

export default CustomButton;