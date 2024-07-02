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
import * as DocumentPicker from 'expo-document-picker';


export default function WorkerBuildProfile({navigation}) {
  const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';
  const [profileSet, setProfileSet] = useState(false);
  const [buildProfile, setBuildProfile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [occupation, setOccupation] = useState('Electrician');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('+254');
  const [date, setDate] = useState();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState();
  const [fileName, setFileName] = useState('');
  const [idPhoto, setIdPhoto] = useState();
  const [idPhotoName, setIdPhotoName] = useState('');
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
  const pickCertificate = async () => {
    DocumentPicker.getDocumentAsync({ type: 'application/pdf' })
      .then(res => {
        setFile(res.assets[0].uri)
        setFileName(res.assets[0].name)
      })
  }
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

  const getIDURL = async () => {
    try{
      const URL = await getDownloadURL(ref(STORAGE,`workerID/${AUTH.currentUser.uid}`));
      console.log(URL);
      return URL;
    }catch(err){
      console.error(err);
    }
  }

  const getCertificateURL = async () => {
    try{
      const URL = await getDownloadURL(ref(STORAGE,`workerCertificates/${AUTH.currentUser.uid}`));
      return URL;
    }catch(err){
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

  const pickID = async () => {
    let result = ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
      base64: true
    });

    setIdPhoto((await result).assets[0].uri);
    setIdPhotoName((await result).assets[0].fileName)
  }

  const uploadImage = async () => {
    setLoading(true);
    if (image == null) {
      console.log('no image');
      setLoading(false);
      return null;
    }

    const uploadUri = image;
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

    // Add timestamp to File Name
    const extension = filename.split('.').pop();
    const name = filename.split('.').slice(0, -1).join('.');
    filename = name + Date.now() + '.' + extension;
    console.log(filename);

    const path = `profilePhotos/${AUTH.currentUser.uid}`
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
              setLoading(false);
            })
            .catch((err) => {
              console.error(err);
            })
        })
      })
  }

  const uploadCertificate = async () => {
    setLoading(true);
    if (file == null) {
      console.log('no file');
      setLoading(false);
      return null;
    }
    const uploadUri = file;
    let filename = fileName;
    const extension = filename.split('.').pop();
    const name = filename.split('.').slice(0, -1).join('.');
    filename = name + Date.now() + '.' + extension;
    console.log(filename);
    const path = `workerCertificates/${AUTH.currentUser.uid}`
    console.log(path);
    const profilePhotoStorage = ref(STORAGE, `${path}`);
    const metadata = {
      contentType: 'application/pdf'
    }
    fetch(file)
      .then((resp) => {
        resp.blob().then(res => {
          uploadBytes(profilePhotoStorage, res, metadata)
            .then((snap) => {
              console.log('uploaded Certificate');
              getCertificateURL();
              setLoading(false);
            })
            .catch((err) => {
              console.error(err);
            })
        })
      })
  }

  const uploadID = async () => {
    setLoading(true);
    if (idPhoto == null) {
      console.log('no image');
      setLoading(false);
      return null;
    }
    const uploadUri = idPhoto;
    let filename = idPhotoName;
    const extension = filename.split('.').pop();
    const name = filename.split('.').slice(0, -1).join('.');
    filename = name + Date.now() + '.' + extension;
    const path = `workerID/${AUTH.currentUser.uid}`
    const profilePhotoStorage = ref(STORAGE, `${path}`);
    const metadata = {
      contentType: 'image/jpeg'
    }
    fetch(idPhoto)
      .then((resp) => {
        resp.blob().then(res => {
          uploadBytes(profilePhotoStorage, res, metadata)
            .then((snap) => {
              console.log('uploaded ID');
              getIDURL();
              setLoading(false);
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
      let photoURL = await getPhotoURL();
      let idURL = await getIDURL();
      let certificateURL = await getCertificateURL();
      setDoc(doc(FIRESTORE_DB, 'Users', uid), { name, phoneNumber, date, occupation, photoURL, idURL, certificateURL, approved:false, ban:false }, { merge: true });
    } catch (err) {
      console.error(err)
    }
  }

  const updateUserProfile = async () => {
    //console.log(AUTH.currentUser);
    setLoading(true);
    updateProfile(AUTH.currentUser, {
      displayName: name, photoURL: await getPhotoURL(),
    }).then((res) => {
      uploadImage().then(uploadCertificate()).then(uploadID())
      .then(()=> writeUserToFirestore())
      .then(()=> navigation.push("LoginScreen"))
    }).catch((err) => {
      setLoading(false);
      console.error(err);
    })
  }

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>

      </Appbar.Header>
      <ScrollView style={styles.container}>
        <KeyboardAvoidingView behavior='position' style={{ flex: 1 }}>
          <Text style={{ textAlign: 'center', fontSize: 20 }}>Lets Get You Going</Text>
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
                <Text style={{ fontSize: 20, margin: 10 }}>
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
              <View style={{ marginTop: 10, ...styles.formItem }}>
                <Text> National ID front side : {idPhotoName} </Text>
                <Button onPress={() => pickID()} mode='contained'> Pick ID Photo </Button>
              </View>
              <View style={styles.formItem}>
                <Text> Certificate for job : {fileName} </Text>
                <Button onPress={() => pickCertificate()} mode='outlined'> Pick Certificare </Button>
              </View>
              <Button onPress={() => updateUserProfile()} mode='elevated'> BUILD PROFILE </Button>
            </>)}
        </KeyboardAvoidingView>
      </ScrollView>
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
  }, formItem: {
    justifyContent: 'space-evenly',
    marginBottom: 10
  }
});
