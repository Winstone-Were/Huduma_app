import { Alert, StyleSheet, Text, View, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Card, ActivityIndicator, Button, Chip, Surface } from 'react-native-paper';
import { FIRESTORE_DB } from '../../firebaseConfig';
import { setDoc, doc, getDoc, collection, onSnapshot, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { AUTH } from '../../firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { writeWorkerJobState, readWorkerState } from '../../Services/stateService'

const JobRequests = ({ navigation }) => {
  const [availableJobs, setAvailableJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [occ, setOcc] = useState('');

  let occupation;

  occupation = (readWorkerState().occupation);

  const getSpecificUserObject = async () => {
    getJobs();
  }

  const checkBan = async () => {
    let userRef = doc(FIRESTORE_DB, 'Users', AUTH.currentUser.uid)
    getDoc(userRef)
      .then(doc => {
        if (doc.data().ban) {
          navigation.replace("BanScreen");
        }
      })
  }

  const getJobs = async () => {
    setLoading(true);
    const q = query(collection(FIRESTORE_DB, 'ServiceRequest'), where("ServiceWanted", '==', occupation || occ));

    onSnapshot(q, (querySnapshot) => {
      if (querySnapshot.empty) {
        setAvailableJobs([])
        setLoading(false);
      } else {
        querySnapshot.forEach((doc) => {
          let emptyArray = [];
          emptyArray.push(doc.data());
          console.log(emptyArray)
          setAvailableJobs(emptyArray);
          setLoading(false);
        })
      }
    }, (onerror) => {
      console.error(onerror.message);
    })
  }

  useEffect(() => {
    getSpecificUserObject();
    checkBan();
  }, []);

  const onAcceptJob = async (jobObject) => {
    setLoading(true);
    //create a document in accepted jobs for the job selected then go to active
    let collectionName = AUTH.currentUser.uid + "::" + jobObject.uid + "::" + jobObject.date;
    let ServiceRequestRef = doc(FIRESTORE_DB, 'AcceptedRequests', collectionName);
    let DateObject = new Date();
    let dateAccepted = DateObject.toISOString();
    let uid = AUTH.currentUser.uid;
    checkBan();
    setDoc(ServiceRequestRef, { ...jobObject, dateAccepted, acceptedBy: uid }, { merge: true })
      .then(async () => {
        writeWorkerJobState(jobObject);
        await deleteDoc(doc(FIRESTORE_DB, 'ServiceRequest', jobObject.uid));
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      })
  }

  return (
    <View style={styles.container}>
      <Button onPress={() => { getJobs() }}> Refresh </Button>
      {
        loading ?
          (<>
            <ActivityIndicator animating />
          </>)
          :
          (<>
            {availableJobs ?
              (<ScrollView style={{ flex: 1, marginHorizontal: 10 }}>
                {
                  availableJobs.map((job, index) => {
                    return (
                      <Card key={index} mode='elevated' style={styles.card}>
                        <Card.Title title={job['clientName']} />
                        <Card.Cover source={{ uri: job['imageURL'] }} />
                        <Card.Content style={{ flex: 1, width: 500 }}>
                          {job['deviceBroken']
                            &&
                            <Surface style={styles.surface} elevation={5}>
                              <Chip style={{ marginTop: 10, width: 200 }} icon="cog"> Damaged Device</Chip>
                              <Text style={{ fontSize: 25 }}> Device Type </Text>
                              <Text> {job['deviceType']} </Text>
                              <Text style={{ fontSize: 25 }}> Device Model </Text>
                              <Text> {job['deviceModel']}  </Text>
                            </Surface>}
                          <Text variant="bodyMedium" style={{ fontSize: 25 }}> Description  </Text>
                          <Text style={{ fontSize: 15 ,width:500 }} numberOfLines={5} lineBreakMode='tail'> {job['description']} </Text>
                          <Chip style={{ marginTop: 10, width: 200 }} icon="account-hard-hat"> {job['ServiceWanted']} </Chip>
                        </Card.Content>
                        <Card.Actions>
                          <Button mode='outlined' onPress={() => onAcceptJob(job)} >Accept</Button>
                          <Button mode='contained'>Reject</Button>
                        </Card.Actions>
                      </Card>
                    )
                  })
                }
              </ScrollView>) :
              (<>
                <ActivityIndicator animating />
                <Text> Loading Jobs </Text>
              </>)}
          </>)
      }
      <Button onPress={() => navigation.push('WorkerHistoryScreen')}> View History </Button>
    </View>
  )
}

export default JobRequests

const styles = StyleSheet.create({
  container: { flex: 1 },
  input: { marginVertical: 5, borderRadius: 0 },
  row: {
    alignItems: "center",
    flexDirection: "row",
    marginVertical: 20,
    justifyContent: "space-between",
  },
  textContainer: { padding: 10 },
  headerText: { fontSize: 40 },
  centerText: {
    fontSize: 20,
    fontStyle: '',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignSelf: "center"
  },
  card: {
    padding: 0
  },
  surface: {
  },
});