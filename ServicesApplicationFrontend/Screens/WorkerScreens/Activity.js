import { Alert, StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Card, ActivityIndicator, Button, Chip } from 'react-native-paper';
import { FIRESTORE_DB } from '../../firebaseConfig';
import { setDoc, doc, getDoc, collection, onSnapshot, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { AUTH } from '../../firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import openMap from 'react-native-open-maps'

import {writeToChatPartyState} from '../../Services/stateService'


const Activity = ({navigation}) => {

  useEffect(() => {
    getActivity();
  }, []);

  const [loading, setLoading] = useState(true);
  const [jobQueryString, setJobQueryString] = useState('');
  const [jobObject, setJobObject] = useState();
  const [working, setWorking] = useState();

  const openGoogleMaps = async () => {
    let latitude = jobObject.currentLocation.latitude;
    let longitude = jobObject.currentLocation.longitude;
    openMap({ latitude, longitude });
  }

  const onDeclineJob = async (jobObject) =>{
    setLoading(true);
    const user_id = jobObject.uid;
    let ServiceRequestRef = doc(FIRESTORE_DB, 'ServiceRequest',user_id);
    let collection_name = AUTH.currentUser.uid+"::"+jobObject.uid+"::"+jobObject.date;
    let DeleteRed = doc(FIRESTORE_DB, 'AcceptedRequests',collection_name);
    setDoc(ServiceRequestRef,jobObject, {merge:true})
      .then(async()=>{
        await deleteDoc(DeleteRed);
        Alert.alert('Job Declined');
        getActivity();
      })
      .catch((err)=>{
        setLoading(false);
      })
  }

  const onArriveLocation = async () => {
    //ask user whether dude has arrived
    //switch screen to dude working
  }

  const onFinishWork = async () => {
    //delete from Active jobs
    //push images to history
  }

  const getActivity = async () => {
    let q = collection(FIRESTORE_DB, "AcceptedRequests");
    onSnapshot(q,(querySnapshot)=> {
      querySnapshot.forEach((doc)=>{
        if (doc.id.split("::")[0] == AUTH.currentUser.uid) {
          let workerId = doc.id.split("::")[0];
          let userId = doc.id.split("::")[1];
          writeToChatPartyState({sentBy:userId,sentTo:workerId})
          setJobQueryString(doc.id);
          setJobObject(doc.data())
          setLoading(false);
        }
      })
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
                <Button> CHAT </Button>
                <Button mode='contained' onPress={()=> onDeclineJob(jobObject)}> DECLINE </Button>
              </Card.Actions>
            </Card>
            <Button mode='contained' onPress={() => openGoogleMaps()}> Open Location </Button>
            <Button mode='elevated'> Arrived At Location </Button>
            <Button onPress={()=> navigation.push('WorkerChatScreen')}> Chat </Button>
          </View>
        )}

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