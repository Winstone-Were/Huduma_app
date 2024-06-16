import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function WorkerHomepage() {
  return (
    <View style={styles.container}>
      <Text>Welcome to the Worker Home Page</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default WorkerHomepage;
