import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Text, TextInput, Button, ActivityIndicator, Portal, Modal } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import JobScreen from './Jobs';
import ProfileScreen from './Profile';
import PendingScreen from './Pending';
import CustomHeader from '../components/CustomHeader'; 

const Tab = createMaterialBottomTabNavigator();

function CustomerHomepage({ navigation }) {
  return (
    <View>
      <Tab.Navigator
        initialRouteName="Jobs"
        activeColor="#e91e63"
        barStyle={{ backgroundColor: 'tomato' }}
      >
        <Tab.Screen
          name="Activity"
          component={PendingScreen}
          options={{
            tabBarLabel: 'Activity',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="clock" color={color} size={26} />
            )
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarLabel: 'Profile',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="account" color={color} size={26} />
            )
          }}
        />
      </Tab.Navigator>
    </View>
  );
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
  textContainer: { alignContent: 'center', alignItems: 'center' },
  Information: {

    color: 'purple',
    fontSize: 15,

  }
});


export default CustomerHomepage;
