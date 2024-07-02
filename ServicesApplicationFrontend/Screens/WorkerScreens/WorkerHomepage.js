import React, { useState, useEffect } from 'react';
import { Appbar } from 'react-native-paper';
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import JobRequestsScreen from './JobRequests';
import ActivityScreen from './Activity';
import ProfileScreen from './Profile';
import CustomHeader from '../../components/CustomHeader'; 

const Tab = createMaterialBottomTabNavigator();

const WorkerHomepage = ({ navigation }) => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    //fetchUsername();
  }, []);

  const fetchUsername = async () => {
    try {
      const storedUsername = await AsyncStorage.getItem('username');
      if (storedUsername) {
        setUsername(storedUsername);
      } else {
        const response = await fetch('http://192.168.100.91:3000/api/profile', {
          method: 'GET',
          headers: {
            
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
      <Appbar.Header mode='small' collapsable={true} style={{backgroundColor:'white'}}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Get Work" />
        <Appbar.Action icon="cog" onPress={() => {navigation.push("Settings")}} />
      </Appbar.Header>
      <Tab.Navigator
        initialRouteName="Requests"
        activeColor="#6200ee" 
        inactiveColor="#888888"
        barStyle={{ backgroundColor: '#ffffff' }}
      >
        <Tab.Screen
          name="Requests"
          component={JobRequestsScreen}
          options={{
            tabBarLabel: 'Requests',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="file-document-outline"
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

export default WorkerHomepage;
