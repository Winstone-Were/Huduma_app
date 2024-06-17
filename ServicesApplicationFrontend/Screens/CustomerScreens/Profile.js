import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Button, Avatar, TextInput, Snackbar, IconButton } from 'react-native-paper';
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
  const [editMode, setEditMode] = useState({
    name: false,
    phoneNumber: false,
    address: false,
    secondaryEmail: false,
  });
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
      await AsyncStorage.setItem('UserDetails', JSON.stringify(user));
      setEditMode({ name: false, phoneNumber: false, address: false, secondaryEmail: false });
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
      });
      if (!result.canceled) {
        const newAvatarUri = `${result.uri}?${new Date().getTime()}`;
        setUser({ ...user, avatar: newAvatarUri });
        await AsyncStorage.setItem('UserDetails', JSON.stringify({ ...user, avatar: newAvatarUri }));
        setSnackbarMessage('Profile picture updated successfully');
        setSnackbarVisible(true);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      setSnackbarMessage('Failed to update profile picture');
      setSnackbarVisible(true);
    }
  };

  const toggleEditMode = (field) => {
    setEditMode({ ...editMode, [field]: !editMode[field] });
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
          <Avatar.Image
            size={100}
            source={user.avatar ? { uri: user.avatar } : require('../../assets/default-user.png')}
            style={styles.avatar}
          />
        </TouchableOpacity>
        <View style={styles.header}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>

        <View style={styles.content}>
          {['name', 'phoneNumber', 'address', 'secondaryEmail'].map((field) => (
            <View key={field} style={styles.inputContainer}>
              <TextInput
                label={capitalize(field)}
                value={user[field]}
                onChangeText={(text) => setUser({ ...user, [field]: text })}
                editable={editMode[field]}
                style={styles.input}
                mode="outlined"
                theme={{ roundness: 10 }}
                right={
                  <TextInput.Icon
                    icon="pencil"
                    onPress={() => toggleEditMode(field)}
                  />
                }
              />
            </View>
          ))}
          {Object.values(editMode).some((isEditing) => isEditing) && (
            <Button mode="contained" style={styles.button} onPress={handleSaveProfile}>
              Save Profile
            </Button>
          )}
        </View>
      </View>

      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000}>
        {snackbarMessage}
      </Snackbar>
    </ScrollView>
  );
};

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

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
  avatar: {
    backgroundColor: '#ccc',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  content: {
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
  },
  button: {
    marginVertical: 10,
    borderRadius: 10,
  },
});

export default ProfileScreen;
