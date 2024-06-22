import React, { useState, useEffect } from 'react';
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { StyleSheet, View, Image, Text } from 'react-native';
import { Appbar, Avatar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

import JobScreen from './Jobs';
import ProfileScreen from './Profile';
import ActivityScreen from './Activity';


const Tab = createMaterialBottomTabNavigator();

const CustomerHomepage = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    fetchUsernameAndProfilePic();
  }, []);

  const fetchUsernameAndProfilePic = async () => {
    try {
      const storedUsername = await AsyncStorage.getItem('username');
      if (storedUsername) {
        setUsername(storedUsername);
        fetchProfilePic();
      } else {
        const response = await fetch('http://192.168.100.91:3000/api/getusers/username', {
          method: 'GET',
          headers: {
            
          },
        });
        if (response.ok) {
          const userData = await response.json();
          setUsername(userData.username);
          fetchProfilePic();
        } else {
          console.error('Failed to fetch username');
        }
      }
    } catch (error) {
      console.error('Error fetching username:', error);
    }
  };

  const fetchProfilePic = async () => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (currentUser) {
        const uid = currentUser.uid;
        const docRef = doc(FIRESTORE_DB, "users", uid);
        const userDoc = await getDoc(docRef);
        if (userDoc.exists()) {
          const profilePicPath = userDoc.data().profilePicPath; // Assuming profilePicPath is the path to the image in Firebase Storage
          if (profilePicPath) {
            const storage = getStorage();
            const storageRef = ref(storage, profilePicPath);
            const url = await getDownloadURL(storageRef);
            setProfilePic(url);
          } else {
            console.error('Profile picture path not found');
          }
        } else {
          console.error('No such document!');
        }
      } else {
        console.error('No user is signed in');
      }
    } catch (error) {
      console.error('Error fetching profile picture:', error);
    }
  };

  return (
    <>
      <Appbar.Header style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.welcomeText}>Welcome, {username}</Text>
        </View>
        <View style={styles.iconContainer}>
          <Appbar.Action icon="cog" onPress={() => navigation.push('Settings')} />
          <Appbar.Action icon="bell" onPress={() => {/* Handle notification icon press */}} />
          <View style={styles.profileIconContainer}>
            {profilePic ? (
              <Image source={{ uri: profilePic }} style={styles.profileIcon} />
            ) : (
              <Avatar.Icon size={40} icon="account" style={styles.avatarIcon} />
            )}
          </View>
        </View>
      </Appbar.Header>
      <Tab.Navigator
        initialRouteName="Jobs"
        activeColor="#ED7D27" // Active tab color (orange)
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
  header: {
    backgroundColor: '#ffffff',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileIconContainer: {
    backgroundColor: '#CCCCCC', // Gray background color for profile icon container
    borderRadius: 20,
    padding: 5,
  },
  profileIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  avatarIcon: {
    backgroundColor: '#CCCCCC', // Gray background color for Avatar.Icon
  },
});

export default CustomerHomepage;
