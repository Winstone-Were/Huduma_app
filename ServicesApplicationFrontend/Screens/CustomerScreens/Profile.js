import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, } from 'react-native';
import { Image } from 'expo-image';
import { Text, Button, Avatar, TextInput, Snackbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import { addDoc, collection, setDoc, doc, getDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';



const ProfileScreen = ({ navigation }) => {

  const [name, setName] = useState('');
  const [phone_number, setPhone_number] = useState('+254');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState();
  const [secEmail, setSecEmail] = useState('');
  const [imageURL, setImageURL] = useState();
  const [dwImage, setDwImage] = useState();
  const [editMode, setEditMode] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [profileExists, setProfileExists] = useState();

  const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

  useEffect(() => {
    if (AUTH.currentUser.displayName) {
      setProfileExists(true);
      setName(AUTH.currentUser.displayName);
      setImageURL(AUTH.currentUser.photoURL);
      const DocRef = doc(FIRESTORE_DB, "Users", AUTH.currentUser.uid);
      getDoc(DocRef)
        .then((res) => {
          setPhone_number(res.data().phone_number);
          setAddress(res.data().address);
          setSecEmail(res.data().secEmail);
        }).catch((err) => console.error);
    } else {
      profileExists(false);
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
        base64: true,
      });
      if (!result.canceled) {
        setUser({ ...user, avatar: result.uri });
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const fetchProfileImage = () => {

  }

  return (
    <ScrollView>
      {profileExists ?
        (
          <>
            <View style={styles.container}>
              <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
                {imageURL ? (
                  <>
                    <Image
                      style={styles.image}
                      source={imageURL}
                      placeholder={{ blurhash }}
                      contentFit="cover"
                      transition={1000}
                    />
                  </>
                ) : (
                  <>
                    <Text> Loading Image</Text>
                  </>
                )}
              </TouchableOpacity>
              <View style={styles.header}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
              </View>

              <View style={styles.content}>
                <TextInput
                  label="Name"
                  value={name}
                  onChangeText={(text) => setName(text)}
                  editable={editMode}
                  style={styles.input}
                />
                <TextInput
                  label="Phone Number"
                  value={phone_number}
                  onChangeText={(text) => setPhone_number(text)}
                  editable={editMode}
                  keyboardType="phone-pad"
                  style={styles.input}
                />
                <TextInput
                  label="Address"
                  value={address}
                  onChangeText={(text) => setAddress(text)}
                  editable={editMode}
                  style={styles.input}
                />
                <TextInput
                  label="Secondary Email"
                  value={secEmail}
                  onChangeText={(text) => setSecEmail(text)}
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
                    <Button mode="contained" style={styles.button} onPress={() => handleSaveProfile()}>
                      Save Profile
                    </Button>
                    <Button style={styles.button} onPress={() => setEditMode(false)}>
                      Cancel
                    </Button>
                  </>
                )}
              </View>
            </View>
          </>
        ) :
        (<>
          <View style={styles.container}>
            <Text> It seems you haven't built your profile yet </Text>
            <Text> Lets Build One</Text>
            <Button onPress={() => { navigation.push('BuildProfileScreen') }}> Build Profile </Button>
          </View>
        </>)}
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
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignSelf: "center"
  },
});

export default ProfileScreen;
