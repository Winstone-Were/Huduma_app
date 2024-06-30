import { View, Text, StyleSheet } from 'react-native'
import React, {useState, useEffect} from 'react'
import { ActivityIndicator, Button } from 'react-native-paper';

import { FIRESTORE_DB } from '../../firebaseConfig';
import { setDoc, doc, getDoc, collection, onSnapshot, query, where, getDocs, deleteDoc, } from 'firebase/firestore';
import { AUTH } from '../../firebaseConfig';

import {writeToChatPartyState} from '../../Services/stateService'

const ActivityScreen = ({navigation}) => {
  const [loading,setloading] = useState(true);
  const [requestSent, setRequestSent] = useState();
  const [workerComing, setWorkerComing] = useState();
  const [currentWorkState, setCurrentWorkState] = useState('');
  const [jobObject, setJobObject] = useState();
  
  const getActivity = async () => {
    let q = collection(FIRESTORE_DB, "AcceptedRequests");
    onSnapshot(q,(querySnapshot)=> {
      querySnapshot.forEach((doc)=>{
        if (doc.id.split("::")[1] == AUTH.currentUser.uid) {
          let workerId = doc.id.split("::")[0];
          let userId = doc.id.split("::")[1];
          writeToChatPartyState({sentBy:userId,sentTo:workerId})
          setJobObject(doc.data());
          setCurrentWorkState('A repair man is coming to you')
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

  useEffect(()=>{
    getActivity();
    getRequestSent();
  })

  return (
    <View style={{flex:1}}>
      {loading ? 
      (<>
        <ActivityIndicator animating/>
      </>)
      :
      (<View>
        <Text>{currentWorkState}</Text>
        <Button onPress={()=> navigation.push('CustomerChatScreen')}> Chat </Button>
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
    width: 300,
    height: 400,
    alignSelf: 'center',
  },
});


export default ActivityScreen;