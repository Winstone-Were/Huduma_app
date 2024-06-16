import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Button, Avatar, TextInput, Snackbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const ProfileScreen = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
    secondaryEmail: '',
    avatar: null,
  });
  const [editMode, setEditMode] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    getUserDetails();
  }, []);

  const getUserDetails = async () => {
    try {
      const userDetails = await AsyncStorage.getItem('UserDetails');
      if (userDetails) {
        const userData = JSON.parse(userDetails);
        setUser({
          name: userData.name || '',
          email: userData.email || '',
          phoneNumber: userData.phoneNumber || '',
          address: userData.address || '',
          secondaryEmail: userData.secondaryEmail || '',
          avatar: userData.avatar || null,
        });
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const updatedUserData = {
        ...user,
        name: user.name,
        phoneNumber: user.phoneNumber,
        address: user.address,
        secondaryEmail: user.secondaryEmail,
      };
      await AsyncStorage.setItem('UserDetails', JSON.stringify(updatedUserData));

      setEditMode(false);
      setSnackbarMessage('Profile updated successfully');
      setSnackbarVisible(true);
    } catch (error) {
      console.error('Error updating profile:', error);
      setSnackbarMessage('Failed to update profile');
      setSnackbarVisible(true);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        base64: true,
      });
      if (!result.canceled) {
        setUser({ ...user, avatar: result.uri });
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
          <Avatar.Image
            size={100}
            source={user.avatar ? { uri: user.avatar } : require('../../assets/default-user.png')}
          />
        </TouchableOpacity>
        <View style={styles.header}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>

        <View style={styles.content}>
          <TextInput
            label="Name"
            value={user.name}
            onChangeText={(text) => setUser({ ...user, name: text })}
            editable={editMode}
            style={styles.input}
          />
          <TextInput
            label="Phone Number"
            value={user.phoneNumber}
            onChangeText={(text) => setUser({ ...user, phoneNumber: text })}
            editable={editMode}
            keyboardType="phone-pad"
            style={styles.input}
          />
          <TextInput
            label="Address"
            value={user.address}
            onChangeText={(text) => setUser({ ...user, address: text })}
            editable={editMode}
            style={styles.input}
          />
          <TextInput
            label="Secondary Email"
            value={user.secondaryEmail}
            onChangeText={(text) => setUser({ ...user, secondaryEmail: text })}
            editable={editMode}
            keyboardType="email-address"
            style={styles.input}
          />
          {!editMode ? (
            <Button mode="contained" style={styles.button} onPress={() => setEditMode(true)}>
              Edit Profile
            </Button>
          ) : (
            <>
              <Button mode="contained" style={styles.button} onPress={handleSaveProfile}>
                Save Profile
              </Button>
              <Button style={styles.button} onPress={() => setEditMode(false)}>
                Cancel
              </Button>
            </>
          )}
        </View>
      </View>

      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000}>
        {snackbarMessage}
      </Snackbar>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center', // Center text horizontally
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
    textAlign: 'center', // Center text horizontally
  },
  content: {
    marginTop: 20,
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginVertical: 10,
  },
});

export default ProfileScreen;
