// NotificationScreen.js

import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, List } from 'react-native-paper';
import { getAuth } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';


const NotificationScreen = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (currentUser) {
        const uid = currentUser.uid;
        const q = query(collection(FIRESTORE_DB, 'notifications'), where('userId', '==', uid));
        const querySnapshot = await getDocs(q);
        const fetchedNotifications = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setNotifications(fetchedNotifications);
      } else {
        console.error('No user is signed in');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <List.Item
            title={item.title}
            description={item.body}
            left={props => <List.Icon {...props} icon="bell" />}
          />
        )}
        ListEmptyComponent={() => (
          <Text style={styles.emptyMessage}>No notifications available</Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#ffffff',
  },
  emptyMessage: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: '#888888',
  },
});

export default NotificationScreen;
