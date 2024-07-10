import { Alert, StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Card, ActivityIndicator, Button, Chip, TextInput, Appbar } from 'react-native-paper';
import { FIRESTORE_DB } from '../../firebaseConfig';
import { setDoc, doc, getDoc, collection, onSnapshot, query, where, getDocs, deleteDoc, orderBy } from 'firebase/firestore';
import { AUTH } from '../../firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import openMap from 'react-native-open-maps';
import { writeToChatPartyState } from '../../Services/stateService'
import * as Location from "expo-location";
import { getChatPartyState } from '../../Services/stateService';
import * as Notifications from "expo-notifications";
import axios from 'axios';


import { readWorkerJobState, writeWorkerJobState, clearWorkerJobState } from '../../Services/stateService';


export default function WorkerPayment() {
    const [pay, setPay] = useState(1);
    const [phone, setPhone] = useState();
    const [loading, setLoading] = useState(false);
    const [servicewanted, setServiceWanted] = useState('');
    const [job_id, setJob_id] = useState('');

    const handleFinishWork = async () => {
        setLoading(true);
        //call stkpush
        //get client Phone Number
        axios.post('http://192.168.100.146:4000/lipa', { amount: pay, phone, servicewanted, job_id })
            .then((result) => {
                console.log(Object.keys(result));
                console.log(result.data);
                setLoading(false);
            }).catch((err) => {

            })

    }

    useEffect(() => {
        let work_state = readWorkerJobState();
        console.log(work_state);
        setPhone(parseInt(work_state.phoneNumber.slice(1)));
        setServiceWanted(work_state.ServiceWanted);
        setJob_id(`${work_state.acceptedBy}::${work_state.uid}`);
    }, [])
    return (
        <View style={{ flex: 1 }}>
            <Appbar.Header>
                <Appbar.Content title="Send STK" />
            </Appbar.Header>
            {loading ?
                (<>
                    <ActivityIndicator />
                </>) :
                (<>
                    <TextInput
                        label="amount"
                        value={pay}
                        onChangeText={(text) => setPay(parseInt(text))}
                        mode='outlined'
                        right={<TextInput.Icon icon="cash-check" />}
                    />
                    <TextInput
                        label="phone number"
                        value={phone}
                        onChangeText={(text) => setPhone(parseInt(text))}
                        mode='outlined'
                        right={<TextInput.Icon icon="card-account-phone" />}
                    />
                    <Button mode='contained' onPress={() => handleFinishWork()}>
                        Send STK
                    </Button>
                </>)}
        </View>
    )
}

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
  