import { Alert, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Card, ActivityIndicator, Button } from 'react-native-paper';
import { FIRESTORE_DB } from '../../firebaseConfig';
import { setDoc, doc, getDoc, collection, onSnapshot } from 'firebase/firestore';
import { AUTH } from '../../firebaseConfig';

const JobRequests = ({ navigation }) => {
  const [availableJobs, setAvailableJobs] = useState([]);
  const [occupation, setOccupation] = useState();
  useEffect(() => {
    const DocRef = doc(FIRESTORE_DB, "Users", AUTH.currentUser.uid);
    getDoc(DocRef)
      .then((res) => {
        setOccupation(res.data().occupation);
      }).catch((err) => console.error);
      onSnapshot(collection(FIRESTORE_DB, 'JobRequests'),
        (snapshot) => {
          snapshot.forEach(doc => {
            if (doc.data()['serviceRequested'] == occupation) {
              setAvailableJobs([doc.data()]);
              console.log(availableJobs); 
            }
          })
        }, (error) => {

        }) 
    const getJobs = async () => {
      const DocRef = doc(FIRESTORE_DB, "AvailableJobs", 'PendingJobjs');
      getDoc(DocRef)
        .then((snapshot) => {
          setAvailableJobs([[snapshot.data()][0]['LYZnSJKtT1TSTehkptLRLSfKuEg2']]);
        })
        .catch((err) => {
          console.error(err);
        })
    }
    //getJobs();
  }, []);
  return (
    <View style={styles.container}>
      <Button> Refresh </Button>
      {availableJobs ?
        (<>
          {
            availableJobs.map((job, index) => {
              return (
                <Card key={index}>
                  <Card.Title title="Requested Job" />
                  <Card.Content>
                    <Text variant="titleLarge">Description</Text>
                    <Text variant="bodyMedium">Area : {job['serviceRequested']}</Text>
                  </Card.Content>
                  <Card.Actions>
                    <Button>Cancel</Button>
                    <Button>Ok</Button>
                  </Card.Actions>
                </Card>
              )
            })
          }
        </>) :
        (<>
          <ActivityIndicator animating />
        </>)}
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

});