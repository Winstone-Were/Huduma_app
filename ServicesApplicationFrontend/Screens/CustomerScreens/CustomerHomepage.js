import React from 'react';
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import JobScreen from './Jobs';
import ProfileScreen from './Profile';
import PendingScreen from './Pending';
import CustomHeader from '../../components/CustomHeader'; 

const Tab = createMaterialBottomTabNavigator();

function CustomerHomepage({ navigation }) {
  return (
    <>
      <CustomHeader
        username="Tijani" // Backend required to have names obtained from the 
        onSettingsPress={() => navigation.navigate('Settings')}///create a settings page...sijadefine bado
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
}

export default CustomerHomepage;
