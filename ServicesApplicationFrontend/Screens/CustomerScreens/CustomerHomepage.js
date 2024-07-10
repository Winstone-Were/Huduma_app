import React, { useState, useEffect } from 'react';
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Alert, StyleSheet, View } from 'react-native';
import { Text, TextInput, Button, ActivityIndicator, Dialog, Appbar, List, Switch } from 'react-native-paper';

import JobScreen from './Jobs';
import ProfileScreen from './Profile';
import ActivityScreen from './Activity';
import { AUTH, FIRESTORE_DB } from '../../firebaseConfig';

import {readCustomerState, writeToCustomerState, clearCustomerState} from '../../Services/stateService'
const Tab = createMaterialBottomTabNavigator();

const CustomerHomepage = ({ navigation }) => {
  let customerUser = readCustomerState();
  const [username, setUsername] = useState('');
  const [dialogVisible, setDialogVisible] = useState(false);

  useEffect(() => {
    // Function to fetch username from AsyncStorage or backend API
    fetchUsername();
  }, [username]);

  const fetchUsername = async () => {
    setUsername(AUTH.currentUser.displayName);
    console.log(customerUser);
  };

  return (
    <>
      <Appbar.Header mode='small' collapsable={true}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={username} />
        <Appbar.Action icon="cog" onPress={() => {navigation.push("Settings")}} />
      </Appbar.Header>
      <Tab.Navigator
        initialRouteName="Jobs"
        activeColor="#6200ee" // Active tab color (orange)
        inactiveColor="#888888" // Inactive tab color (grey)
        barStyle={{ backgroundColor: '#ffffff' }} // Background color of the tab bar
      >
        <Tab.Screen
          name="Jobs"
          component={JobScreen}
          options={{
            tabBarLabel: 'Jobs',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="briefcase"
                color={color}
                size={26}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Activity"
          component={ActivityScreen}
          options={{
            tabBarLabel: 'Activity',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="clock"
                color={color}
                size={26}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarLabel: 'Profile',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="account"
                color={color}
                size={26}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", marginHorizontal: 30 },
  input: { marginVertical: 5, borderRadius: 0 },
  row: {
    alignItems: "center",
    flexDirection: "row",
    marginVertical: 20,
    justifyContent: "space-between",
  },
  textContainer: { alignContent: 'center', alignItems: 'center' }

});

export default CustomerHomepage;