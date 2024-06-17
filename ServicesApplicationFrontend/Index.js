import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Provider as StoreProvider } from 'react-native-paper';

import AuthStack from './Navigation/AuthStack'; 
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function Index() {
  return (

      <SafeAreaProvider style={{flex:1}}>
        <AuthStack />
      </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
