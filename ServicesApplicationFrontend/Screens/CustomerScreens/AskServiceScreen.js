/*{ "address": "MRRC+V5G, Gandhi Ave, Nairobi, Kenya", 
    "currentLocation": { "accuracy": 100, "altitude": 1647.800048828125, "altitudeAccuracy": 100, "heading": 0, "latitude": -1.3082526, "longitude": 36.8209864, "speed": 0 }, 
    "date": { "nanoseconds": 0, "seconds": 1717448399 }, 
    "locationName": "MF 11, Madaraka Estate, Karuri Gakure Rd, Nairobi, Kenya", 
    "phone_number": "+254729291438", 
    "role": "client", "secEmail":
     "stoniedev@gmail.com", 
     "secondaryEmail": "stonie2k17@gmail.com", 
     "username": "Victus 16" }*/

import { View, TouchableOpacity, KeyboardAvoidingView, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Text, Button, TextInput, Divider, Appbar, ActivityIndicator } from 'react-native-paper';
import React, { useEffect, useRef, useState } from 'react';
import { Image } from 'expo-image';


import { CameraView, useCameraPermissions, Camera } from 'expo-camera';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import MapScreen from './MapScreen';
import * as Location from "expo-location";

import { STORAGE } from '../../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import { setDoc, doc, getDoc } from 'firebase/firestore';

import { writeAskForJobState, getAskForJobState, cleatAskForJobState } from '../../Services/stateService';


const TakePhotos = (props) => {
    const cameraRef = useRef();
    const [images, setImages] = useState([]);
    const [permission, requestPermission] = useCameraPermissions();
    useEffect(() => {
        requestPermission();
        __startCamera();
    }, [])
    const __startCamera = async () => {
        const { status } = await Camera.getCameraPermissionsAsync();
        if (status === 'granted') {
            // do something

        } else {
            Alert.alert("Access denied")
        }
    }
    const __takePicture = async () => {
        const photo = await cameraRef.current.takePictureAsync();
        props.setStateImage(photo.uri)
        console.log(photo);
        props.closeCamera(false);
    }

    return (

        <View style={{ flex: 1 }}>
            <CameraView ref={cameraRef} style={{ flex: 1 }}>
            </CameraView>
            <Button onPress={() => __takePicture()}> Take photo </Button>
            <Button onPress={() => props.closeCamera(false)}> Go Back </Button>
        </View>
    )
}

let serviceWanted = getAskForJobState().serviceWanted;
export default function AskServiceScreen({navigation}) {
    
    const [isPickingPhoto, setIsPickingPhoto] = useState(false);
    const [isSettingLocation, setIsSettingLocation] = useState(false);
    const [currentLocation, setCurrentLocation] = useState('');
    const [locationName, setLocationName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState();
    const [imageURL, setImageURL] = useState();
    const [loading, setLoading] = useState();
    const blurhash =
        '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

    const getUploadPath = async () => {
        try {
           const uid = AUTH.currentUser.uid;
            return `ServiceRequestPhotos/${uid}`;
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
                        .then(async (snap) => {
                            setImageURL(await getPhotoURL());
                        })
                        .catch((err) => {
                            console.error(err);
                        })
                })
            })
    }

    const PushToFirestore = async () => {
        setLoading(true);
        await uploadImage();
        console.log(description);
        let ServiceRequestRef = doc(FIRESTORE_DB, 'ServiceRequest', AUTH.currentUser.uid);
        let uid = AUTH.currentUser.uid
        let clientName = AUTH.currentUser.displayName
        let imageURL = await getPhotoURL();
        let ServiceWanted = await getAskForJobState().serviceWanted;
        setDoc(ServiceRequestRef, {uid, clientName, imageURL, ServiceWanted, description, locationName}, {merge:true})
            .then(()=>{
                setLoading(false);
                navigation.push("CustomerHomepage");
            }).catch(err=>{
                setLoading(false);
                console.error(err);
            })
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {loading ?
                (<View style={{ flex: 1, justifyContent: 'center' }}>
                    <ActivityIndicator size={40} animating />
                </View>) : (<>
                    {isPickingPhoto || isSettingLocation ?
                        (<>
                            {isPickingPhoto ?
                                (<>
                                    <TakePhotos closeCamera={setIsPickingPhoto} setStateImage={(val) => setImage(val)} />
                                </>) :
                                (<>
                                    <MapScreen
                                        setState={(val) => setLocationName(val)}
                                        setStateCurrentLocation={(val) => setCurrentLocation(val)}
                                    />
                                    <Text style={{ alignSelf: 'center', fontSize: 20 }}> {locationName} </Text>
                                    <Button onPress={() => setIsSettingLocation(false)}> Select Location</Button>
                                </>)}
                        </>) :
                        (<View>
                            <Appbar.Header>
                            <Appbar.BackAction onPress={() => navigation.goBack()} />
                                <Appbar.Content title="Describe Your Situation" />
                                
                            </Appbar.Header>
                            <ScrollView>
                                <Text style={{alignSelf:'center'}}> {serviceWanted} Service </Text>
                                <TextInput
                                    multiline
                                    label='Describe the issue'
                                    numberOfLines={10}
                                    onChangeText={(text) => setDescription(text)}
                                    value={description}
                                />
                            </ScrollView>

                            <Image
                                style={styles.image}
                                source={{ uri: image }}
                                placeholder={{ blurhash }}
                                contentFit="cover"
                                transition={1000}
                            />

                            <Button onPress={() => setIsPickingPhoto(!isPickingPhoto)}> ADD A PHOTO </Button>
                            <Text style={{ alignSelf: 'center', fontSize: 20 }}> Location : {locationName} </Text>
                            <Button onPress={() => setIsSettingLocation(true)}> PICK LOCATION </Button>
                            <Button onPress={() => PushToFirestore()}> Ask for Service </Button>
                        </View>)}
                </>)}

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, marginHorizontal: 20, marginTop: 40 },
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
        marginLeft: 2
    },
    image: {
        width: 300,
        height: 400,
        alignSelf: 'center',
    },
});
