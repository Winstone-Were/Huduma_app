import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { Button } from 'react-native-paper';

export default function NotApprovedScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>Your Work account has not yet been approved</Text>
      <Button mode="contained" onPress={() => navigation.replace('WorkerBuildProfileScreen')} style={styles.button}>
        Go to Build Profile
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  message: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#6200ee',
  },
});
