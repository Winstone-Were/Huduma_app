import { View, Text, Alert } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { Appbar } from 'react-native-paper';
import { GiftedChat } from 'react-native-gifted-chat';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';


import { AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import { getChatPartyState } from '../../Services/stateService';

export default function CustomerChat() {
  const [messages, setMessages] = useState([]);
  const { sentBy, sentTo } = getChatPartyState();
  const [uid, setUid] = useState('');
  const getMessages = async () => {

  }

  const onSendMessage = async (msgArray) => {
    const msg = msgArray[0];
    const time = new Date();
    const userMsg = {
      ...msg,
      sentBy,
      sentTo,
      createdAt: time
    }
    setMessages(previousMessages => GiftedChat.append(previousMessages, userMsg));

    const docRef = collection(FIRESTORE_DB, 'chats', `${sentBy}::${sentTo}`, 'messages');
    await addDoc(docRef, { ...userMsg, createdAt: time });
  }

  const getAllMessages = async () => {
    let chatid = `${sentBy}::${sentTo}`;
    // var msgList = []
    const q = query(collection(FIRESTORE_DB, 'chats', chatid, 'messages'), orderBy('createdAt', "desc"));
    onSnapshot(q, (snapshot) => {
      setMessages(
        snapshot.docs.map(doc => ({ ...doc.data(), createdAt: doc.data().createdAt.toDate() }))
      )
    }
    );

  }

  useEffect(() => {
    getAllMessages();
    setUid(AUTH.currentUser.uid);
  }, [])
  const onSend = useCallback((messages = []) => {
    Alert.alert("I call");
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    )
  }, [])
  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header mode='small' collapsable={true} style={{ backgroundColor: 'white' }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Chat With Worker" />
        <Appbar.Action icon="cog" onPress={() => { navigation.push("Settings") }} />
      </Appbar.Header>
      <GiftedChat
        messages={messages}
        onSend={messages => onSendMessage(messages)}
        user={{
          _id: uid,
        }}
      />
    </View>
  )
}