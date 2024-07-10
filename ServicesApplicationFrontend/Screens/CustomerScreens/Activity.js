import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { ActivityIndicator, Button, Card, Chip, TextInput } from 'react-native-paper';
import { Image } from 'expo-image';
import { FIRESTORE_DB } from '../../firebaseConfig';
import { setDoc, doc, getDoc, collection, onSnapshot, query, where, getDocs, deleteDoc, orderBy } from 'firebase/firestore';
import { AUTH } from '../../firebaseConfig';

import { writeToChatPartyState, writeToWorkerState, readWorkerState, writeAskForJobState } from '../../Services/stateService';
import call from 'react-native-phone-call';
import { getChatPartyState } from '../../Services/stateService';
import * as Notifications from "expo-notifications";
import { Rating } from 'react-native-ratings';
import RBSheet from 'react-native-raw-bottom-sheet';


const ActivityScreen = ({ navigation }) => {
  const [loading, setloading] = useState(true);
  const [requestSent, setRequestSent] = useState();
  const [workerComing, setWorkerComing] = useState(false);
  const [currentWorkState, setCurrentWorkState] = useState('');
  const [jobObject, setJobObject] = useState();
  const [workerID, setWorkerID] = useState()
  const [worker, setWorker] = useState();
  const [imageURL, setImageURL] = useState();
  const [workURL, setWorkURL] = useState('')
  const [jobFinished, setJobFinished] = useState(false);

  const [collectionName, setCollectionName] = useState('');

  //FormStates
  const [formLoading, setFormLoading] = useState(false);
  const [arrivaTime, setArrivalTime] = useState(0);
  const [satisfaction, setSatisfaction] = useState(0);
  const [payment, setPayment] = useState(0);
const [starRating, setStarRating] = useState(0);

  const getActivity = async () => {
    let q = collection(FIRESTORE_DB, "AcceptedRequests");
    onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (doc.id.split("::")[1] == AUTH.currentUser.uid) {
          writeAskForJobState({ collectionName: doc.id });
          setWorkURL(doc.id);
          work_url = doc.id;
          let workerId = doc.id.split("::")[0];
          worker_id = workerId;
          let userId = doc.id.split("::")[1];
          writeToChatPartyState({ sentBy: userId, sentTo: workerId })
          setJobObject(doc.data());
          setCurrentWorkState('A repair man is coming to you');
          getWorkerProfile();
          setWorkerComing(true);
          setloading(false);
        }
      })
    })
  }

  const getRequestSent = async () => {
    let q = doc(FIRESTORE_DB, 'ServiceRequest', AUTH.currentUser.uid);
    onSnapshot(q, (snapshot) => {
      if (snapshot.exists) {
        setWorkerComing(true)
      }
    })
  }

  const getWorkerProfile = async () => {
    if (jobObject) {
      let workerRef = doc(FIRESTORE_DB, 'Users', jobObject.acceptedBy)
      getDoc(workerRef)
        .then((doc) => {
          console.log(doc.data());
          setWorker(doc.data());
          setImageURL(doc.data().photoURL)
        })
        .catch(err => console.error);
    } else {
      console.log('worker loaded')
    }
  }

  const onDeclineJob = async (jobObject) => {
    setloading(true);
    const user_id = jobObject.uid;
    let ServiceRequestRef = doc(FIRESTORE_DB, 'ServiceRequest', user_id);
    let collection_name = jobObject.acceptedBy + "::" + jobObject.uid + "::" + jobObject.date;
    let DeleteRed = doc(FIRESTORE_DB, 'AcceptedRequests', collection_name);
    setDoc(ServiceRequestRef, jobObject, { merge: true })
      .then(async () => {
        await deleteDoc(DeleteRed);
        Alert.alert('Job Declined');
        getActivity();
      })
      .catch((err) => {
        setloading(false);
      })
  }

  const getJobFinished = async () => {
    let q = collection(FIRESTORE_DB, "FinishedJobs");
    onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (doc.id.split("::")[1] == AUTH.currentUser.uid) {
          setCollectionName(doc.id);
          setloading(false);
          setJobFinished(true);
        }
      })
    })
  }

  useEffect(() => {
    getActivity();
    getWorkerProfile();
    getJobFinished();
  }, [])

  const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

  const onWorkerArrive = async () => {
    //Add to DB that worker has arrived
    setloading(true);
    let workerArriveRef = doc(FIRESTORE_DB, 'StartedJobs', workURL);
    let startDate = new Date();
    let startTime = startDate.toISOString();
    setDoc(workerArriveRef, { ...jobObject, startTime })
      .then(() => {
        //setloading(false);
      }).catch(err => console.error);

  }

  const handleFormSubmit = async () => {
    setFormLoading(true);
    let JobsHistoryRef = doc(FIRESTORE_DB, 'NewJobsHistory', collectionName);
    let DeleteRef = doc(FIRESTORE_DB, 'FinishedJobs', collectionName);
    let DeleteRed = doc(FIRESTORE_DB, 'AcceptedRequests', collectionName);
    setDoc(JobsHistoryRef, { ...jobObject, arrivaTime, satisfaction, starRating, payment }, { merge: true })
      .then(() => {
        deleteDoc(DeleteRef);
        deleteDoc(DeleteRed);
        navigation.replace('CustomerHomepage');
      }).catch(err => {
        console.error(err);
        setFormLoading(false);
      })
  }

  const cancelJob = async () => {
    let docRef = doc(FIRESTORE_DB, 'ServiceRequest', AUTH.currentUser.uid);
    await deleteDoc(docRef);
  }

  const refRBSheet = useRef();

  return (
    <View style={{ flex: 1 }}>
      {loading ?
        (<>
          <ActivityIndicator animating />
        </>)
        :
        (<View style={{ flex: 1 }}>
          {workerComing ?
            (<>
              <Button onPress={() => cancelJob()}> Cancel Job Request </Button>
              {jobFinished ?
                (<>
                  <View style={styles.container}>
                    <Text> Worker Has Finshed Job</Text>
                    <Text> Please Fill the form Bellow </Text>
                    <TextInput
                      style={styles.input}
                      mode='outlined'
                      label='Worker Arrived on Time 0-5'
                      value={arrivaTime}
                      onChangeText={(text) => setArrivalTime(text)}
                      maxLength={2}
                      disabled={formLoading}
                    />
                    <TextInput
                      style={styles.input}
                      mode='outlined'
                      label="Satisfied by Worker's job 0-5"
                      value={satisfaction}
                      onChangeText={(text) => setSatisfaction(text)}
                      maxLength={2}
                      disabled={formLoading}
                    />
                   <Text>Rate the Worker's Service:</Text>
                    <Rating
                      startingValue={starRating}
                      imageSize={30}
                      onFinishRating={(rating) => setStarRating(rating)}
                      style={{ paddingVertical: 10 }}
                    />
                    <Button onPress={() => handleFormSubmit()} disabled={formLoading}> Submit </Button>
                  </View>
                </>)
                :
                (<>
                  <Card mode='elevated'>
                    {worker ?
                      (<>
                        <Card.Content>
                          <Chip style={{ marginTop: 10 }} icon="account-hard-hat"> {worker.occupation} </Chip>
                          <View style={styles.row}>
                            <Image
                              style={styles.image}
                              source={{ uri: imageURL }}
                              placeholder={{ blurhash }}
                              contentFit="cover"
                              transition={1000}
                            />
                            <View>
                              <Text> Name {worker.name} </Text>
                              <Text> Phone Number {worker.phoneNumber} </Text>
                            </View>
                          </View>
                        </Card.Content>
                        <Card.Actions>
                          <Button onPress={() => navigation.push('CustomerChatScreen')}> In App Text </Button>
                          <Button onPress={() => {
                            let number = worker.phoneNumber;
                            call({ number, prompt: true })
                          }}> Call </Button>
                          <Button onPress={() => onDeclineJob(jobObject)}> Decline </Button>
                        </Card.Actions>
                        <Card.Actions>
                          <Button mode='outlined' onPress={() => onWorkerArrive()}> Worker Has Arrived </Button>
                        </Card.Actions>
                        <Button onPress={() => refRBSheet.current.open()}> Worker Stats </Button>
                        <RBSheet
                          ref={refRBSheet}
                          useNativeDriver={false}
                          customStyles={{
                            wrapper: {
                              backgroundColor: 'transparent',
                            },
                            draggableIcon: {
                              backgroundColor: '#000',
                            },
                          }}
                          customModalProps={{
                            animationType: 'slide',
                            statusBarTranslucent: true,
                          }}
                          customAvoidingViewProps={{
                            enabled: false,
                          }}>
                          <View style={{ flex: 1 }}>
                          <Button mode='contained' onPress={() => refRBSheet.current.close()}> Close </Button>
                            <View style={styles.container}>
                              <Chip style={{ marginTop: 10 }} icon="account-hard-hat"> {worker.occupation} </Chip>
                              <Chip style={{ marginTop: 10 }} icon="wrench"> Jobs : {worker.jobs} </Chip>
                              <Chip style={{ marginTop: 10 }} icon="arrow-up-down"> Rating :{worker.rating} </Chip>
                              <Chip style={{ marginTop: 10 }} icon="cash-minus"> Average cost : {worker.averagecost} </Chip>
                            </View>
                          </View>
                        </RBSheet>
                      </>) : (<>
                        <ActivityIndicator animating />
                        <TouchableOpacity onPress={() => getWorkerProfile()}>
                          <Text> Loading Worker Details</Text>
                        </TouchableOpacity>
                      </>)}
                  </Card>
                </>)}
            </>) :
            (<>
            </>)}
        </View>)}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {marginHorizontal: 20, marginTop: 10 },
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
    width: 150,
    height: 150,
    borderRadius: 100,
    alignSelf: 'center',
  },
});


export default ActivityScreen;