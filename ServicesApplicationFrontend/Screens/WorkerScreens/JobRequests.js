import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Card, ActivityIndicator, Button } from 'react-native-paper';
import { FIRESTORE_DB } from '../../firebaseConfig';
import { setDoc, doc, getDoc } from 'firebase/firestore';


const JobRequests = () => {
  const [availableJobs, setAvailableJobs] = useState();
  useEffect(() => {
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
    getJobs();
  }, []);
  return (
    <View style={styles.container}>
      {availableJobs ?
        (<>
          {
            availableJobs.map((job) => {
              return (
                <Card>
                  <Card.Title title="Requested Job" />
                  <Card.Content>
                    <Text variant="titleLarge">Description</Text>
                    <Text variant="bodyMedium">Area : {job['Area']}</Text>
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