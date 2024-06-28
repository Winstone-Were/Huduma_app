import { Alert, StyleSheet, Text, View, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Card, ActivityIndicator, Button, Chip } from 'react-native-paper';
import { FIRESTORE_DB } from '../../firebaseConfig';
import { setDoc, doc, getDoc, collection, onSnapshot, query, where, getDocs } from 'firebase/firestore';
import { AUTH } from '../../firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const JobRequests = ({ navigation }) => {
  const [availableJobs, setAvailableJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [occ, setOcc] = useState('');
  let occupation;
  const getSpecificUserObject = async () => {
    AsyncStorage.getItem('specific-user-object')
      .then(result => {
        const user = JSON.parse(result);
        occupation = user.occupation;
        setOcc(occupation);
        getJobs();
      })
  }

  const getJobs = async () => {
    setLoading(true);
    try {
      const q = query(collection(FIRESTORE_DB, 'ServiceRequest'), where("ServiceWanted", '==', occupation || occ));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        setAvailableJobs([])
        setLoading(false);
        Alert.alert('Empty')
      }
      querySnapshot.forEach((doc) => {
        let emptyArray = [];
        emptyArray.push(doc.data());
        console.log(emptyArray)
        setAvailableJobs(emptyArray);
        setLoading(false);
      });
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getSpecificUserObject();
    const q = query(collection(FIRESTORE_DB, 'JobRequests'), where("serviceRequested", '==', occupation || occ));
    onSnapshot(q,
      (querySnapshot) => {
        if (querySnapshot.empty) {
          setAvailableJobs([])
          setLoading(false);
        }
        querySnapshot.forEach((doc) => {
          let emptyArray = [];
          emptyArray.push(doc.data());
          setAvailableJobs(emptyArray);
          setLoading(false);
        })
      }
    )
  }, []);
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
              (<ScrollView style={{flex:1, marginHorizontal:10  }}>
                {
                  availableJobs.map((job, index) => {
                    return (
                      <Card key={index} mode='elevated' style={styles.card}>
                        <Card.Title title={job['clientName']} />
                        <Card.Cover source={{uri:job['imageURL']}}/>
                        <Card.Content>
                          <Text variant="bodyMedium"> Description  </Text>
                          <Text> {job['description']} </Text>
                          <Chip style={{ marginTop: 10, width: 200 }} icon="account-hard-hat"> {job['ServiceWanted']} </Chip>
                        </Card.Content>
                        <Card.Actions>
                          <Button mode='outlined'>Accept</Button>
                          <Button mode='outlined'>Reject</Button>
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
    </View>
  )
}

export default JobRequests

const styles = StyleSheet.create({
  container: { flex: 1},
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
    width:500
  }
});