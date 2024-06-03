import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const CustomHeader = ({ username, onSettingsPress }) => {
  return (
    <SafeAreaView style={styles.headerContainer}>
      <View style={styles.headerContent}>
        <Text style={styles.welcomeText}>Welcome, {username}</Text>
        <TouchableOpacity onPress={onSettingsPress}> 
          <MaterialCommunityIcons name="cog" color="#000" size={26} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>///to fit the space
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#fff',
    elevation: 4, // shadow for Android
    shadowColor: '#000', // shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CustomHeader;
