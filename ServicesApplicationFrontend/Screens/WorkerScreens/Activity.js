import { Alert, StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Card, ActivityIndicator, Button, Chip } from 'react-native-paper';
import { FIRESTORE_DB } from '../../firebaseConfig';
import { setDoc, doc, getDoc, collection, onSnapshot, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { AUTH } from '../../firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import openMap from 'react-native-open-maps';
import { writeToChatPartyState } from '../../Services/stateService'
import * as Location from "expo-location";


const Activity = ({ navigation }) => {

  useEffect(() => {
    getActivity();
    getLocation();
  }, []);

  const getLocation = async () => {
    let location = await Location.getCurrentPositionAsync({});
    let { latitude, longitude } = location.coords;
    let AreaName = await Location.reverseGeocodeAsync({ latitude, longitude });
  }

  const [startArea, setStartArea] = useState('');
  const [jobQueryString, setJobQueryString] = useState('');
  const [jobObject, setJobObject] = useState();
  const [working, setWorking] = useState(false);
  const [arrived, setArrived] = useState();
  const [collectionName, setCollectionName] = useState();
  const [loading, setLoading] = useState(true);


  const openGoogleMaps = async () => {
    let latitude = jobObject.currentLocation.latitude;
    let longitude = jobObject.currentLocation.longitude;
    let endArea = jobObject.locationName
    console.log(latitude, longitude)
    openMap({ latitude, longitude, start: startArea, end: endArea });
  }

  const onDeclineJob = async (jobObject) => {
    setLoading(true);
    const user_id = jobObject.uid;
    let ServiceRequestRef = doc(FIRESTORE_DB, 'ServiceRequest', user_id);
    let collection_name = AUTH.currentUser.uid + "::" + jobObject.uid + "::" + jobObject.date;
    let DeleteRed = doc(FIRESTORE_DB, 'AcceptedRequests', collection_name);
    setDoc(ServiceRequestRef, jobObject, { merge: true })
      .then(async () => {
        deleteDoc(DeleteRed)
          .then(() => {
            setJobObject(null);
          })
          .catch((err) => {
            console.error(err);
          })
      })
      .catch((err) => {
        setLoading(false);
      })
  }

  const checkArriveLocation = async () => {
    //ask user whether dude has arrived
    //switch screen to dude working
    const q = query(collection(FIRESTORE_DB, 'StartedJobs'));
    onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        console.log('No Work');
      }
      snapshot.forEach((Doc) => {
        if (Doc.id == collectionName) {
          setArrived(true);
          let DeleteRed = doc(FIRESTORE_DB, 'AcceptedRequests', collectionName);

        }
      })
    }, (onError) => {
      console.error(onError);
    })
  }

  const onFinishWork = async () => {
    //delete from Active jobs
    //push images to history
  }

  const getActivity = async () => {
    let q = collection(FIRESTORE_DB, "AcceptedRequests");
    onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (doc.id.split("::")[0] == AUTH.currentUser.uid) {
          let workerId = doc.id.split("::")[0];
          let userId = doc.id.split("::")[1];
          setCollectionName(doc.id);
          writeToChatPartyState({ sentBy: userId, sentTo: workerId })
          setJobQueryString(doc.id);
          setJobObject(doc.data())
          setLoading(false);
        }
        if (querySnapshot.empty) {
          setJobObject(null);
        }
      })
    })
    checkArriveLocation();
  }

  const [worktime, setWorkTime] = useState(0);

  useEffect(() => {
    let interval;
    if (working) {
      interval = setInterval(() => {
        setWorkTime((prevTime) => prevTime + 1000);
      }, 1000);
    } else if (!working) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [working]);

  const handleFinishWork = async () => {
    setLoading(true);
    let DeleteRed = doc(FIRESTORE_DB, 'StartedJobs', collectionName);
    let FinishRef = doc(FIRESTORE_DB, 'FinishedJobs', collectionName);
    let finishtime = (new Date ()).toISOString();
    let elapsedTime = worktime/1000;
    setDoc(FinishRef, { ...jobObject, finishtime, elapsedTime})
      .then(() => {
        setLoading(false);
        deleteDoc(DeleteRed);
        navigation.replace("WorkerHomepage");
      })
      .catch((err) => {
        console.error(err);
      })
  }


  return (
    <View style={{ flex: 1 }}>
      {loading ?
        (
          <>
            <ActivityIndicator animating />
            <View style={styles.row}>
              <Text style={{ fontSize: 15 }}>No Activity</Text>
              <TouchableOpacity onPress={() => getActivity()}>
                <Text style={styles.Information}> Click To Refresh</Text>
              </TouchableOpacity>
            </View>
          </>
        ) :
        (
          <View style={{ flex: 1 }}>
            {jobObject ?
              (<>
                <Card mode='elevated' >
                  <Card.Title title="Current Job" />
                  <Card.Content>
                    <Text>Client {jobObject['clientName']} </Text>
                  </Card.Content>
                  <Card.Cover source={{ uri: jobObject['imageURL'] }} />
                  <Card.Content>
                    <Text variant="bodyMedium"> Description  </Text>
                    <Text> {jobObject['description']} </Text>
                    <Chip style={{ marginTop: 10, width: 200 }} icon="account-hard-hat"> {jobObject['ServiceWanted']} </Chip>
                  </Card.Content>
                  <Card.Actions>
                    <Button onPress={() => navigation.push('WorkerChatScreen')}> Chat </Button>
                    <Button mode='contained' onPress={() => onDeclineJob(jobObject)}> DECLINE </Button>
                  </Card.Actions>
                </Card>
                <Button mode='contained' onPress={() => openGoogleMaps()}> Open Location </Button>
                <Button mode='elevated' onPress={() => checkArriveLocation()}> Arrived At Location </Button>
              </>) :
              (<>
              </>)}
          </View>

        )}
      {
        arrived ?
          (<View>
            <Text> You Have Arrived </Text>
            <Button mode='contained' onPressOut={() => setWorking(true)}> Start Working </Button>
            <Text> {worktime/1000} s </Text>
            <Button mode='outlined' onPress={() => handleFinishWork()} > Stop Working </Button>
          </View>) :
          (<>
          </>)
      }
    </View>
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


export default Activity;