import { View, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { Card, Button, ActivityIndicator, Appbar, Text, TextInput } from 'react-native-paper';
import { Image } from 'expo-image';

import React, { useEffect, useState } from 'react';

import { AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import { setDoc, doc, getDoc, collection, onSnapshot, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import call from 'react-native-phone-call';
import { getAskForJobState } from '../../Services/stateService';

export default function ClientComplain({navigation}) {
  const [complaint, setComplaint] = useState('');
  const [loading, setLoading] = useState(false);
  const handleComplaintSubmit = async () => {
    setLoading(true);
    let { collectionName } = getAskForJobState();
    const complaintRef = doc(FIRESTORE_DB, 'Complaints', collectionName);
    setDoc(complaintRef, { collectionName, complaint })
      .then(() => {
        setLoading(false);
        navigation.replace('CustomerHomepage');
      }).catch(err => console.error(err));
  }
  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header mode='small' collapsable={true}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Your History" />
        <Appbar.Action icon="cog" onPress={() => { navigation.push("Settings") }} />
      </Appbar.Header>
      <TextInput
        label="What's your complaint ?"
        multiline={true}
        line={20}
        value={complaint}
        onChangeText={(text) => setComplaint(text)}
      />
      <Button onPress={handleComplaintSubmit}>  Send </Button>
    </View>
  )
}