import React, { useState, useEffect } from 'react';
import { Image } from 'expo-image';
import { Text, Button, TextInput, Snackbar, Paragraph, Portal, Modal } from 'react-native-paper';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import DateTimePicker from '@react-native-community/datetimepicker'; // Import DateTimePicker

const ProfileScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [phone_number, setPhone_number] = useState('+254');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [secEmail, setSecEmail] = useState('');
  const [dob, setDob] = useState(new Date()); // Default to current date
  const [username, setUsername] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [profileExists, setProfileExists] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false); // State to show/hide date picker
  const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

  useEffect(() => {
    if (AUTH.currentUser.displayName) {
      setProfileExists(true);
      setName(AUTH.currentUser.displayName);
      setImageURL(AUTH.currentUser.photoURL);
      console.log(AUTH.currentUser);
      setSecEmail(AUTH.currentUser.email);
      const DocRef = doc(FIRESTORE_DB, "Users", AUTH.currentUser.uid);
      getDoc(DocRef)
        .then((res) => {
          setPhone_number(res.data().phone_number);
          setAddress(res.data().address);
          setSecEmail(res.data().secEmail);
        }).catch((err) => console.error);
    } else {
      setProfileExists(false);
    }

  }, []);

  const handleSaveProfile = async () => {
    updateProfile(AUTH.currentUser, {
      displayName: name
    }).then((res)=>{
      setDoc(doc(FIRESTORE_DB, 'Users', AUTH.currentUser.uid), {phone_number, address, secEmail}, {merge:true})
        .then((resp)=>{
          console.log(resp);
        })
        .catch((err)=> console.error);
    }).catch((err)=>{
      console.error(err);
    })

  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (!result.cancelled) {
        setImageURL(result.uri);
        setSnackbarMessage('Profile picture updated successfully');
        setSnackbarVisible(true);
      }
    } catch (err) {
      console.error('Error picking image:', err);
      setSnackbarMessage('Failed to update profile picture');
      setSnackbarVisible(true);
    }
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const hideDatePickerModal = () => {
    setShowDatePicker(false);
  };

  const handleDateChange = (selectedDate) => {
    const currentDate = selectedDate || dob;
    hideDatePickerModal();
    setDob(currentDate);
  };

  return (
    <ScrollView style={styles.container}>
      {profileExists ? (
        <View style={styles.profileContainer}>
          <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
            {imageURL ? (
              <Image
                style={styles.image}
                source={{ uri: imageURL }}
                placeholder={{ blurhash }}
                contentFit="cover"
                transition={1000}
              />
            ) : (
              <Text>Loading Image</Text>
            )}
          </TouchableOpacity>
          <View style={styles.header}>
            <Text style={styles.userName}>{name}</Text>
            <Text style={styles.userEmail}>{email}</Text>
          </View>
          <View style={styles.content}>
            <TextInput
              label="Username"
              value={username}
              onChangeText={(text) => setUsername(text)}
              editable={editMode}
              keyboardType="default"
              style={styles.input}
              mode="outlined"
            />
            <TextInput
              label="Name"
              value={name}
              onChangeText={(text) => setName(text)}
              editable={editMode}
              style={styles.input}
              mode="outlined"
            />
            <TextInput
              label="Phone Number"
              value={phone_number}
              onChangeText={(text) => setPhone_number(text)}
              editable={editMode}
              keyboardType="phone-pad"
              style={styles.input}
              mode="outlined"
            />
            <TextInput
              label="Address"
              value={address}
              onChangeText={(text) => setAddress(text)}
              editable={editMode}
              style={styles.input}
              mode="outlined"
            />
            <TextInput
              label="Secondary Email"
              value={secEmail}
              onChangeText={(text) => setSecEmail(text)}
              editable={editMode}
              keyboardType="email-address"
              style={styles.input}
              mode="outlined"
            />
            <TouchableOpacity onPress={showDatePickerModal}>
              <TextInput
                label="Date of Birth"
                value={dob ? dob.toLocaleDateString() : ''}
                editable={false}
                style={styles.input}
                mode="outlined"
              />
            </TouchableOpacity>

            <Portal>
              <Modal visible={showDatePicker} onDismiss={hideDatePickerModal} contentContainerStyle={styles.modal}>
                <View>
                  <DateTimePicker
                    value={dob || new Date()}
                    mode="date"
                    display="spinner"
                    onChange={(event, selectedDate) => handleDateChange(selectedDate)}
                  />
                  <Button mode="contained" onPress={hideDatePickerModal} style={styles.modalButton}>
                    Done
                  </Button>
                </View>
              </Modal>
            </Portal>

            <Button mode="contained" style={styles.editButton} onPress={() => setEditMode(!editMode)}>
              {editMode ? 'Cancel' : 'Edit Profile'}
            </Button>
            {editMode && (
              <Button mode="contained" style={styles.saveButton} onPress={handleSaveProfile}>
                Save Changes
              </Button>
            )}
          </View>
        </View>
      ) : (
        <View style={styles.profileContainer}>
          <Text style={styles.noProfileText}>It seems you haven't built your profile yet.</Text>
          <Button
            mode="contained"
            style={styles.buildProfileButton}
            onPress={() => navigation.push('BuildProfileScreen')}
          >
            Build Profile
          </Button>
        </View>
      )}
      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000}>
        {snackbarMessage}
      </Snackbar>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileContainer: {
    padding: 20,
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    textAlign: 'center',
  },
  userEmail: {
    fontSize: 16,
    color: '#777',
    marginTop: 5,
    textAlign: 'center',
  },
  content: {
    marginTop: 20,
  },
  input: {
    marginBottom: 10,
  },
  editButton: {
    marginTop: 20,
    borderRadius: 10,
  },
  saveButton: {
    marginTop: 10,
    borderRadius: 10,
  },
  buildProfileButton: {
    alignSelf: 'center',
    marginTop: 20,
  },
  noProfileText: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
    color: '#777',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignSelf: 'center',
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
});

export default ProfileScreen;
