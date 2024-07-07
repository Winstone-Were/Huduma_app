import * as React from 'react';
import { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image, SafeAreaView, ScrollView, Alert } from 'react-native';
import { Dialog, Portal, Button, ActivityIndicator } from 'react-native-paper';

import { AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import { setDoc, doc, getDoc, collection, onSnapshot, query, where, getDocs, deleteDoc, } from 'firebase/firestore';
import {writeAskForJobState} from '../../Services/stateService'

const occupations = [
  { id: '1', name: 'Electrician', icon: require('../../assets/Icons/electrician.png') },
  { id: '2', name: 'Maid', icon: require('../../assets/Icons/maid.jpg') },
  { id: '3', name: 'Gardener', icon: require('../../assets/Icons/gardener.png') },
  { id: '4', name: 'Chef', icon: require('../../assets/Icons/chef.png') },
  { id: '5', name: 'Exterminator', icon: require('../../assets/Icons/exterminator.png') },
  { id: '6', name: 'Plumber', icon: require('../../assets/Icons/plumber.png') },
  { id: '7', name: 'Carpenter', icon: require('../../assets/Icons/carpenter.png') },
  { id: '8', name: 'Pet services', icon: require('../../assets/Icons/dogwalker.png') },
];

const OccupationItem = ({ name, icon, onPress }) => (
  <TouchableOpacity style={styles.occupationItem} onPress={onPress}>
    <Image source={icon} style={styles.icon} />
    <Text style={styles.occupationText}>{name}</Text>
  </TouchableOpacity>
);

const JobScreen = ({ navigation }) => {

  const cancelJob = async () => {
    let docRef = doc(FIRESTORE_DB, 'ServiceRequest', AUTH.currentUser.uid);
    await deleteDoc(docRef);
  }

  const [onJob, setOnJob] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loadingJobRequest, setLoadingJobRequest] = useState(false);
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const [serviceWanted, setServiceWanted] = useState('');

  const handleJobPress = (jobType) => {
    console.log("Selected job type:", jobType);
    setServiceWanted(jobType);
    showDialog();
    // Navigation logic or further actions based on jobType
  };

  const handleJobRequest = async () => {
    setLoadingJobRequest(true);
    if(onJob){
      Alert.alert('Alert','You already have a job in queue', 
      [{
        text: 'Cancel Job',
        onPress: () => cancelJob()
      }, {
        text:'Close'
      }])
    }else{
      writeAskForJobState({serviceWanted});
      navigation.push("AskServiceScreen");
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {loadingJobRequest ?
        (<>
          <ActivityIndicator style={{alignSelf:'center'}} animating size={80}/>
        </>) :
        (<>
          <ScrollView contentContainerStyle={styles.grid}>
            {occupations.map((occupation) => (
              <OccupationItem
                key={occupation.id}
                name={occupation.name}
                icon={occupation.icon}
                onPress={() => handleJobPress(occupation.name)}
              />
            ))}
            <Portal>
              <Dialog visible={visible} onDismiss={hideDialog}>
                <Dialog.Title>Alert</Dialog.Title>
                <Dialog.Content>
                  <Text variant="bodyMedium">Do you want to get a {serviceWanted}</Text>
                </Dialog.Content>
                <Dialog.Actions>
                  <Button onPress={() => handleJobRequest()}>Yes</Button>
                  <Button onPress={hideDialog}>Cancel</Button>
                </Dialog.Actions>
              </Dialog>
            </Portal>
          </ScrollView>
        </>)}
        <Button mode='outlined' onPress={()=>{ navigation.push('CustomerHistoryScreen')}}> View History </Button>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingVertical: 16,
  },
  occupationItem: {
    width: '40%',
    backgroundColor: '#ffffff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ED7D27',
    elevation: 3,
  },
  icon: {
    width: 80,
    height: 80,
    marginBottom: 8,
  },
  occupationText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default JobScreen;
