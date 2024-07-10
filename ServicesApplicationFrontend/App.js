import Index from './Index';
import { enGB, registerTranslation } from 'react-native-paper-dates';
import * as Notifications from "expo-notifications";
registerTranslation('en-GB', enGB);
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { View } from 'react-native';
import { FIRESTORE_DB, AUTH } from "./firebaseConfig";
import React, { useEffect, useState } from 'react';
import { getChatPartyState } from './Services/stateService';

export default function App() {

  return (
    <View style={{flex:1}}>
          <Index />
    </View>

  );
}
