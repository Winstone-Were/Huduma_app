import React, { useState, useEffect } from 'react';
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import JobScreen from './Jobs';
import ProfileScreen from './Profile';
import PendingScreen from './Pending';
import CustomHeader from '../../components/CustomHeader'; 
const Tab = createMaterialBottomTabNavigator();

const CustomerHomepage = ({ navigation }) => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Function to fetch username from AsyncStorage || backend API
    fetchUsername();
  }, []);

  const fetchUsername = async () => {
    try {
      // Example: Fetch username from AsyncStorage
      const storedUsername = await AsyncStorage.getItem('username');
      if (storedUsername) {
        setUsername(storedUsername);
      } else {
        // If username not found in AsyncStorage
        const response = await fetch('http://192.168.100.91:3000/api/profile', {//add enpoint
          method: 'GET',
          headers: {
            // authorization token
          },
        });
        if (response.ok) {
          const userData = await response.json();
          setUsername(userData.username);
        } else {
          console.error('Failed to fetch username');
        }
      }
    } catch (error) {
      console.error('Error fetching username:', error);
    }
  };

  return (
    <>
      <CustomHeader
        username={username} // Pass dynamically fetched username to CustomHeader
        onSettingsPress={() => navigation.navigate('Settings')} 
      />
      <Tab.Navigator
        initialRouteName="Jobs"
        activeColor="#e91e63"
        barStyle={{ backgroundColor: '#ED7D27' }}
      >
        <Tab.Screen
          name="Jobs"
          component={JobScreen}
          options={{
            tabBarLabel: 'Jobs',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="briefcase" color={color} size={26} />
            )
          }}
        />
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
    </>
  );
};

export default CustomerHomepage;