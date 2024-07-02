import Index from './Index';
import { enGB, registerTranslation } from 'react-native-paper-dates';
import * as Notifications from "expo-notifications";
registerTranslation('en-GB', enGB);
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { View } from 'react-native';
import { FIRESTORE_DB, AUTH } from "./firebaseConfig";
import React, { useEffect, useState } from 'react';
import { getChatPartyState } from './Services/stateService';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const generateNotification = async () => {
  //show the notification to the user
  Notifications.scheduleNotificationAsync({
    //set the content of the notification
    content: {
      title: "Huduma App",
      body: "You might have a new message",
    },
    trigger: null,
  });
};

export default function App() {
  useEffect(() => {
    if (getChatPartyState() && AUTH.currentUser) {
      let { sentBy, sentTo } = getChatPartyState();
      if (sentBy == AUTH.currentUser.uid || sentTo == AUTH.currentUser.uid && sentTo != AUTH.currentUser.uid) {
        let chatid = `${sentBy}::${sentTo}`;
        console.log(chatid, AUTH.currentUser.uid)
        const q = query(collection(FIRESTORE_DB, 'chats', chatid, 'messages'), orderBy('createdAt', "desc"));
        onSnapshot(q, (snapshot) => {
          generateNotification();
        }
        );
      }
    }
  }, []);
  return (
    <View style={{flex:1}}>
          <Index />
    </View>

  );
}
