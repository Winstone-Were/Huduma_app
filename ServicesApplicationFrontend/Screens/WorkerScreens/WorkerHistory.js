import { View, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { Card, Button, ActivityIndicator, Appbar, Text } from 'react-native-paper';
import { Image } from 'expo-image';

import React, { useEffect, useState } from 'react';

import { AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import { setDoc, doc, getDoc, collection, onSnapshot, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import call from 'react-native-phone-call';


export default function WorkerHistory({ navigation }) {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [clientName, setClientName] = useState('');
    const [clientNumber, setClientNumber] = useState('')
    const [workid, setWorkId] = useState();
    const [earned, setEarned] = useState(0);
    useEffect(() => {
        fetchUserHistory();
    }, []);
    const fetchUserHistory = async () => {
        setLoading(true);
        const q = query(collection(FIRESTORE_DB, 'JobsHistory'))
        onSnapshot(q, (snapsot) => {
            let EmptyArray = [];
            snapsot.forEach((doc) => {
                if (doc.id.split("::")[0] == AUTH.currentUser.uid) {
                    //setHistory(doc.data());
                    setWorkId(doc.id);
                    EmptyArray.push(doc.data());
                    setEarned(prev => (prev + parseInt(doc.data().payment)))
                    console.log(EmptyArray);
                    setClientName(doc.data().clientName);
                    setHistory(EmptyArray);
                }
            })
            setLoading(false);
            //console.log(history.length)
        }, (onerror) => {
            console.error(onerror.message);
        })
    }
    const getWorkerDetails = async (uid) => {
        let WorkerRef = doc(FIRESTORE_DB, 'Users', uid);
        const TempArray = [];
        worker.forEach(element => {
            TempArray.push(element);
        })
        return getDoc(WorkerRef)
            .then((resp) => {
                TempArray.push(resp.data());
                //console.log(TempArray);
                setWorker(TempArray);
                // console.log(worker)
            }).catch((err => {
                console.error(err);
            }));
    }
    const blurhash =
        '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';
    return (
        <View style={{ flex: 1 }}>
            <Appbar.Header mode='small' collapsable={true}>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Your History" />
                <Appbar.Action icon="cog" onPress={() => { navigation.push("Settings") }} />
            </Appbar.Header>
            <Button onPress={fetchUserHistory}> Refresh </Button>
            {loading ?
                (<>
                    <ActivityIndicator animating size={80} />
                </>) :
                (<>
                    <Text style={styles.occupationText}> Earned </Text>
                    <Text> {earned} </Text>
                    <ScrollView style={{ flex: 1 }}>
                        {history.map((job, index) => {
                            return (
                                <Card key={index} mode='elevated' style={{ width: 500, flex: 1, marginBottom: 10 }}>
                                    <Card.Title title={job.ServiceWanted} />
                                    <Card.Content>
                                        <Text style={styles.occupationText}> Served </Text>
                                        <View style={styles.row}>
                                            <Image
                                                style={styles.image}
                                                source={{ uri: job.imageURL }}
                                                placeholder={{ blurhash }}
                                                contentFit="cover"
                                                transition={1000}
                                            />
                                            <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center', marginLeft: 20 }}>
                                                <Text> Name : {job.clientName} </Text>
                                                <Text> Phone Number :{job.phone_number} </Text>
                                                <Button mode='outlined'
                                                    onPress={() => {
                                                        let number = job.phone_number;
                                                        call({ number });
                                                    }}
                                                > Call </Button>
                                            </View>
                                        </View>
                                    </Card.Content>
                                    <Card.Content>
                                        <Text style={styles.occupationText}> Description </Text>
                                        <Text> {job.description} </Text>
                                        <Text style={styles.occupationText}> Area </Text>
                                        <Text> {job.locationName} </Text>
                                        <Text style={styles.occupationText}> Date </Text>
                                        <Text> {job.dateAccepted} </Text>
                                    </Card.Content>
                                    <Card.Actions>
                                        <Button mode='contained'>
                                            Report
                                        </Button>
                                    </Card.Actions>
                                </Card>
                            )
                        })}
                    </ScrollView>
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
        width: '100%',
        height: '100%',
        marginBottom: 8,
    },
    occupationText: {
        color: '#000000',
        fontSize: 26,
        fontWeight: 'bold',
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 100,
        alignSelf: "center",
        marginRigt: 20,
    },
    row: {
        alignItems: "center",
        flexDirection: "row",
        marginVertical: 20,
    },
});