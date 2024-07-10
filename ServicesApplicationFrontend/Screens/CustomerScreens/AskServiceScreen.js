import { View, TouchableOpacity, KeyboardAvoidingView, StyleSheet, SafeAreaView, ScrollView, Alert, Platform } from 'react-native';
import { Text, Button, TextInput, Appbar, ActivityIndicator, Menu } from 'react-native-paper';
import React, { useEffect, useRef, useState } from 'react';
import { Image } from 'expo-image';
import DateTimePicker from '@react-native-community/datetimepicker';
import { CameraView, useCameraPermissions, Camera } from 'expo-camera';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import MapScreen from './MapScreen';
import * as Location from "expo-location";
import { STORAGE } from '../../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { writeAskForJobState, getAskForJobState, cleatAskForJobState, readCustomerState } from '../../Services/stateService';

const TakePhotos = (props) => {
    const cameraRef = useRef();
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
        props.closeCamera(false);
    }

    return (
        <View style={{ flex: 1 }}>
            <CameraView ref={cameraRef} style={{ flex: 1 }} />
            <Button onPress={() => __takePicture()}> Take photo </Button>
            <Button onPress={() => props.closeCamera(false)}> Go Back </Button>
        </View>
    )
}

let serviceWanted = getAskForJobState().serviceWanted;

export default function AskServiceScreen({ navigation }) {

    const [isPickingPhoto, setIsPickingPhoto] = useState(false);
    const [isSettingLocation, setIsSettingLocation] = useState(false);
    const [currentLocation, setCurrentLocation] = useState('');
    const [locationName, setLocationName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState();
    const [imageURL, setImageURL] = useState();
    const [loading, setLoading] = useState();
    const [urgency, setUrgency] = useState('');
    const [showMenu, setShowMenu] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [selectedTime, setSelectedTime] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [deviceBroken, setDeviceBroken] = useState(false);
    const [deviceType, setDeviceType] = useState('');
    const [deviceModel, setDeviceModel] = useState('');
    const blurhash = '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

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
        };

        fetch(image)
            .then((resp) => {
                resp.blob().then(res => {
                    uploadBytes(profilePhotoStorage, res, metadata)
                        .then(async () => {
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
        let ServiceRequestRef = doc(FIRESTORE_DB, 'ServiceRequest', AUTH.currentUser.uid);
        let phoneNumber = readCustomerState().phone_number;
        let uid = AUTH.currentUser.uid
        let clientName = AUTH.currentUser.displayName;
        let imageURL = await getPhotoURL();
        let ServiceWanted = await getAskForJobState().serviceWanted;
        let DateObject = new Date();
        let date = DateObject.toISOString();
        let time = selectedTime.toISOString().split('T')[1].split('.')[0];
        let appointmentDate = selectedDate.toISOString().split('T')[0];

        setDoc(ServiceRequestRef, {
            uid, clientName, imageURL, ServiceWanted, description, locationName, date, deviceBroken,
            deviceType,
            deviceModel, currentLocation, phoneNumber
        }, { merge: true })
            .then(() => {
                navigation.replace('CustomerHomepage');
            }).catch(err => {
                setLoading(false);
                console.error(err);
            })
    }

    const onTimeChange = (event, selectedDate) => {
        const currentDate = selectedDate || selectedTime;
        setShowTimePicker(false);
        setSelectedTime(currentDate);
    };

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || selectedDate;
        setShowDatePicker(false);
        setSelectedDate(currentDate);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Request Details" />
            </Appbar.Header>

            {loading ?
                (<View style={styles.loadingContainer}>
                    <ActivityIndicator size={40} animating />
                </View>
                ) : (
                    <>
                        {isPickingPhoto || isSettingLocation ? (
                            <>
                                {isPickingPhoto ? (
                                    <TakePhotos closeCamera={setIsPickingPhoto} setStateImage={(val) => setImage(val)} />
                                ) : (
                                    <>
                                        <MapScreen
                                            setState={(val) => setLocationName(val)}
                                            setStateCurrentLocation={(val) => setCurrentLocation(val)}
                                        />
                                        <Text style={styles.locationText}>{locationName}</Text>
                                        <Button onPress={() => setIsSettingLocation(false)}>Select Location</Button>
                                    </>
                                )}
                            </>
                        ) : (
                            <KeyboardAvoidingView
                                behavior={Platform.OS === "ios" ? "padding" : "height"}
                                style={{ flex: 1 }}
                            >
                                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                                    <Text style={styles.title}>{serviceWanted} Service Details</Text>
                                    <Image
                                        style={styles.image}
                                        source={{ uri: image }}
                                        placeholder={{ blurhash }}
                                        contentFit="cover"
                                        transition={1000}
                                    />
                                    <Button onPress={() => setIsPickingPhoto(!isPickingPhoto)}>ADD A PHOTO</Button>
                                    <View style={styles.row}>
                                        <Text style={styles.label}>Is it a broken Appliance?</Text>
                                        <Button
                                            mode="contained"
                                            onPress={() => setDeviceBroken(!deviceBroken)}
                                            style={[styles.input, { backgroundColor: deviceBroken ? 'green' : 'red', marginVertical: 10 }]}
                                        >
                                            {deviceBroken ? 'Yes' : 'No'}
                                        </Button>
                                    </View>
                                    <TextInput
                                        label="Appliance Type"
                                        value={deviceType}
                                        onChangeText={(text) => setDeviceType(text)}
                                        style={styles.input}
                                    />
                                    <TextInput
                                        label="Appliance Model"
                                        value={deviceModel}
                                        onChangeText={(text) => setDeviceModel(text)}
                                        style={styles.input}
                                    />

                                   
                                    <TextInput
                                        label="Describe the Issue"
                                        value={description}
                                        onChangeText={(text) => setDescription(text)}
                                        style={styles.input}
                                        multiline
                                        numberOfLines={4}
                                    />
                                    <Menu
                                        visible={showMenu}
                                        onDismiss={() => setShowMenu(false)}
                                        anchor={<Button onPress={() => setShowMenu(true)}>{urgency || "Select Urgency"}</Button>}
                                    >
                                        <Menu.Item onPress={() => { setUrgency("Low"); setShowMenu(false); }} title="Low" />
                                        <Menu.Item onPress={() => { setUrgency("Medium"); setShowMenu(false); }} title="Medium" />
                                        <Menu.Item onPress={() => { setUrgency("High"); setShowMenu(false); }} title="High" />
                                    </Menu>
                                    <Button onPress={() => setIsSettingLocation(!isSettingLocation)}>SET LOCATION</Button>

                                </ScrollView>
                                <Button
                                    mode="contained"
                                    onPress={() => PushToFirestore()}
                                    style={styles.submitButton}
                                >
                                    Ask for Service
                                </Button>
                            </KeyboardAvoidingView>
                        )}
                    </>
                )
            }
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollViewContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    title: {
        fontSize: 20,
        marginVertical: 10,
        fontWeight: 'bold',
    },
    image: {
        width: '100%',
        height: 200,
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
    },
    input: {
        marginVertical: 10,
    },
    submitButton: {
        margin: 20,
        paddingVertical: 10,
    },
    locationText: {
        fontSize: 16,
        padding: 10,
    },
});

