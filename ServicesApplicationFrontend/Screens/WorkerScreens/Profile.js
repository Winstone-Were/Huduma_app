import { View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Image } from 'expo-image';
import { Text, TextInput, Button, Switch, HelperText, Menu, Divider, ActivityIndicator, Appbar, SegmentedButtons, Chip } from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates';
import * as ImagePicker from 'expo-image-picker';
import { AUTH, FIRESTORE_DB, STORAGE } from '../../firebaseConfig';
import { addDoc, collection, setDoc, doc, getDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Profile({ navigation }) {
  useEffect(() => {
    if (AUTH.currentUser.displayName) {
      setProfileSet(true);
      setName(AUTH.currentUser.displayName);
      setImageURL(AUTH.currentUser.photoURL);
      console.log(AUTH.currentUser);
      const DocRef = doc(FIRESTORE_DB, "Users", AUTH.currentUser.uid);
      getDoc(DocRef)
        .then((res) => {
          setPhoneNumber(res.data().phoneNumber);
          setOccupation(res.data().occupation);
        }).catch((err) => console.error);
    } else {
      setProfileSet(false);
    }
  })
  const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';
  const [profileSet, setProfileSet] = useState(false);
  const [buildProfile, setBuildProfile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [occupation, setOccupation] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('+254');
  const [date, setDate] = useState();
  const [open, setOpen] = useState(false);
  const onDismissSingle = React.useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirmSingle = React.useCallback(
    (params) => {
      setOpen(false);
      setDate(params.date);
    },
    [setOpen, setDate]
  );
  const [image, setImage] = useState();
  const [imageURL, setImageURL] = useState('');

  const getUploadPath = async () => {
    try {
      const UserObject = await AsyncStorage.getItem('user');
      const user = JSON.parse(UserObject);
      return `profilePhotos/${user.user.uid}`;
    } catch (err) {
      console.error(err);
    }
  }

  const getPhotoURL = async () => {
    try {
      const refPath = await getUploadPath();
      const pathReference = ref(STORAGE, refPath);
      const URL = await getDownloadURL(pathReference);
      setImageURL(URL);
      console.log(URL);
      return URL;
    } catch (err) {
      console.error(err);
    }
  }

  const pickImage = async () => {
    let result = ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
      base64: true
    });

    setImage((await result).assets[0].uri);
    setImageURL((await result).assets[0].uri);
  }

  const uploadImage = async () => {
    if (image == null) {
      return null;
    }
    const uploadUri = image;
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

    // Add timestamp to File Name
    const extension = filename.split('.').pop();
    const name = filename.split('.').slice(0, -1).join('.');
    filename = name + Date.now() + '.' + extension;
    console.log(filename);

    const path = await getUploadPath();
    console.log(path);
    const profilePhotoStorage = ref(STORAGE, `${path}`);

    const metadata = {
      contentType: 'image/jpeg'
    }

    fetch(image)
      .then((resp) => {
        resp.blob().then(res => {
          uploadBytes(profilePhotoStorage, res, metadata)
            .then((snap) => {
              console.log('uploaded profile photo');
              getPhotoURL();
            })
            .catch((err) => {
              console.error(err);
            })
        })
      })
  }

  const writeUserToFirestore = async () => {
    try {
      const UserObject = await AsyncStorage.getItem('user');
      const user = JSON.parse(UserObject);
      let uid = user.user.uid;
      setDoc(doc(FIRESTORE_DB, 'Users', uid), { name, phoneNumber, date, occupation }, { merge: true });
    } catch (err) {
      console.error(err)
    }
  }

  const updateUserProfile = async () => {
    console.log(AUTH.currentUser);
    setLoading(true);
    updateProfile(AUTH.currentUser, {
      displayName: name, photoURL: await getPhotoURL(),
    }).then((res) => {
      uploadImage();
      writeUserToFirestore();
      navigation.push("LoginScreen");

    }).catch((err) => {
      setLoading(false);
      console.error(err);
    })
  }

  const editProfile = async () => {
    setLoading(true);
    updateProfile(AUTH.currentUser, {
      displayName: name, photoURL: await getPhotoURL(),
    }).then((res) => {
      navigation.push("LoginScreen");
    }).catch((err) => {
      setLoading(false);
      console.error(err);
    })
  }
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      {profileSet ?
        (<>
          <ScrollView style={styles.container}>
            <TouchableOpacity onPress={() => pickImage()}>
              <Image
                style={styles.image}
                source={{ uri: imageURL }}
                placeholder={{ blurhash }}
                contentFit="cover"
                transition={1000}
              />
            </TouchableOpacity>
            <TextInput
              value={name}
              onChangeText={(text) => setName(text)}
              mode='outlined'
              label='user name'
              disabled={loading}
            />
            <TextInput
              value={phoneNumber}
              onChangeText={(text) => setPhoneNumber(text)}
              mode='outlined'
              label='phone number'
              disabled={loading}
            />
            <Chip style={{ marginTop: 10 }} icon="account-hard-hat"> {occupation} </Chip>
            <Button onPress={() => editProfile()}> Update Profile </Button>
          </ScrollView>
        </>) :
        (<>
          {
            buildProfile ?
              (<>
                <ScrollView style={styles.container}>
                  <KeyboardAvoidingView behavior='position' style={{ flex: 1 }}>
                    <Text>Lets Get You Going</Text>
                    <TouchableOpacity onPress={() => pickImage()}>
                      <Image
                        style={styles.image}
                        source={{ uri: imageURL }}
                        placeholder={{ blurhash }}
                        contentFit="cover"
                        transition={1000}
                      />
                    </TouchableOpacity>
                    <Text>What best describes your occupation </Text>
                    <SegmentedButtons
                      value={occupation}
                      onValueChange={setOccupation}
                      buttons={
                        [
                          {
                            value: 'Electrician',
                            label: 'Electrician'
                          },
                          {
                            value: 'Plumber',
                            label: 'Plumber'
                          },
                          {
                            value: 'Maid',
                            label: 'Maid'
                          }
                        ]
                      }
                    />
                    <TextInput
                      value={name}
                      onChangeText={(text) => setName(text)}
                      mode='outlined'
                      label='user name'
                      disabled={loading}
                    />
                    <TextInput
                      value={phoneNumber}
                      onChangeText={(text) => setPhoneNumber(text)}
                      mode='outlined'
                      label='phone number'
                      disabled={loading}
                    />

                    <TouchableOpacity onPress={() => setOpen(true)}>
                      {date ?
                        (<>
                          <Text style={{ fontSize: 20 }}>
                            D.O.B  {date.toString()}
                          </Text>
                        </>) :
                        (<>
                          <Text style={{ fontSize: 20, }}>
                            Dob
                          </Text>
                        </>)}

                    </TouchableOpacity>
                    <DatePickerModal
                      mode="single"
                      visible={open}
                      onDismiss={onDismissSingle}
                      date={date}
                      onConfirm={onConfirmSingle}
                      label='Select your Birth Date'
                    />
                    {loading ? (<>
                      <ActivityIndicator animating />
                    </>) :
                      (<>
                        <Button onPress={() => updateUserProfile()} mode='elevated'> BUILD PROFILE </Button>
                      </>)}
                  </KeyboardAvoidingView>
                </ScrollView>
              </>)
              :
              (<>
                <View style={styles.row}>
                  <Text style={styles.Information}>
                    Seems you dont have a built profile
                  </Text>
                  <TouchableOpacity onPress={() => setBuildProfile(true)}>
                    <Text style={styles.textLink}>
                      Build it Now
                    </Text>
                  </TouchableOpacity>
                </View>
              </>)
          }

        </>)}
    </View>

  )
}

const styles = StyleSheet.create({
  container: { flex: 1, marginHorizontal: 20, marginTop: 40, },
  input: { marginVertical: 5, borderRadius: 0 },
  row: {
    alignItems: "center",
    flexDirection: "row",
    marginVertical: 20,
  },
  textContainer: { alignContent: 'center', alignItems: 'center' },
  Information: {
    color: 'purple',
    fontSize: 15,
  },
  textLink: {
    color: 'orange',
    marginLeft: 2,
    fontSize: 15
  }, image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignSelf: "center",
    marginBottom: 20
  },
});
