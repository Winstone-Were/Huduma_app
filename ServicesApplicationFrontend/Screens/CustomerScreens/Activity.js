import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { ActivityIndicator, Button, Card, Chip, TextInput } from 'react-native-paper';
import { Image } from 'expo-image';
import { FIRESTORE_DB } from '../../firebaseConfig';
import { setDoc, doc, getDoc, collection, onSnapshot, query, where, getDocs, deleteDoc, } from 'firebase/firestore';
import { AUTH } from '../../firebaseConfig';

import { writeToChatPartyState, writeToWorkerState, readWorkerState, writeAskForJobState } from '../../Services/stateService';
import call from 'react-native-phone-call';

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
  const [payment,setPayment] = useState(0);

  const getActivity = async () => {
    let q = collection(FIRESTORE_DB, "AcceptedRequests");
    onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (doc.id.split("::")[1] == AUTH.currentUser.uid) {
          writeAskForJobState({collectionName:doc.id});
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
    getDocs(collection(FIRESTORE_DB, "ServiceRequest"))
      .then((result) => {
        result.forEach((doc) => {
          if (doc.id == AUTH.currentUser.uid) {
            setCurrentWorkState('Your request has been placed')
            setloading(false);
          }
        })
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
          setJobFinished(true);
        }
      })
    })
  }

  useEffect(() => {
    getActivity();
    getRequestSent();
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
        setloading(false);
      }).catch(err => console.error);
    //Take Start Time
    //Start Job
    //Bottom Sheet to end work

  }

  const handleFormSubmit = async () =>{
    setFormLoading(true);
    let JobsHistoryRef = doc(FIRESTORE_DB, 'JobsHistory', collectionName);
    let DeleteRef = doc(FIRESTORE_DB, 'FinishedJobs', collectionName);
    setDoc(JobsHistoryRef, {...jobObject, arrivaTime, satisfaction, payment}, {merge:true})
      .then(()=>{ 
        deleteDoc(DeleteRef);
        navigation.replace('CustomerHomepage');
      }).catch(err=>{ 
        console.error(err);
        setFormLoading(false);
      })
  }

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
                      onChangeText={(text)=> setArrivalTime(text)}
                      maxLength={2}
                      disabled={formLoading}
                    />
                    <TextInput
                      style={styles.input}
                      mode='outlined'
                      label="Satisfied by Worker's job 0-5"
                      value={satisfaction}
                      onChangeText={(text)=> setSatisfaction(text)}
                      maxLength={2}
                      disabled={formLoading}
                    />
                    <TextInput
                      style={styles.input}
                      mode='outlined'
                      label="How much did you pay ?"
                      value={payment}
                      onChangeText={(text)=> setPayment(text)}
                      maxLength={6}
                      disabled={formLoading}
                    />
                    <Button onPress={()=> handleFormSubmit()} disabled={formLoading}> Submit </Button>
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
    width: 150,
    height: 150,
    borderRadius: 100,
    alignSelf: 'center',
  },
});


export default ActivityScreen;