
import React, { useEffect } from "react";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MD2LightTheme as DefaultTheme, MD2Colors, MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";

import Login from "../Screens/Login";
import Register from "../Screens/Register";
import BuildProfile from "../Screens/BuildProfile";
import Home from "../Screens/Home";
import ForgotPassword from "../Screens/ForgotPassword";
import SplashScreen from "../Screens/SplashScreen";
import WorkerHomepage from "../Screens/WorkerScreens/WorkerHomepage";
import CustomerHomepage from "../Screens/CustomerScreens/CustomerHomepage";
import Settings from "../Screens/SettingScreens/Settings";
import ChangePassword from "../Screens/SettingScreens/ChangePassword";
import ChangeEmail from "../Screens/SettingScreens/ChangeEmail";
import MapScreen from "../Screens/CustomerScreens/MapScreen";
import Profile from "../Screens/WorkerScreens/Profile";
import AskServiceScreen from "../Screens/CustomerScreens/AskServiceScreen";
import CustomerChat from "../Screens/CustomerScreens/CustomerChat";
import WorkerChat from "../Screens/WorkerScreens/WorkerChat";
import CustomerHistory from "../Screens/CustomerScreens/CustomerHistory";
import WorkerHistory from "../Screens/WorkerScreens/WorkerHistory";
import ClientComplain from "../Screens/CustomerScreens/ClientComplain";
import BanScreen from "../Screens/SettingScreens/BanScreen";
import NotApprovedScreen from "../Screens/SettingScreens/NotApprovedScreen";
import WorkerBuildProfile from "../Screens/WorkerScreens/WorkerBuildProfile";
import ActivityScreen from "../Screens/CustomerScreens/Activity";

const Stack = createNativeStackNavigator();
const noHeader = { headerShown: false };

const theme = {
    ...DefaultTheme,
    roundness: 0,
    colors: {
      ...DefaultTheme.colors,
      primary: "#FF7000",
      accent: "#FFAC4A",
      background: "#FFFFFF",
      text: "#000000",
    },
  };

import * as Notifications from "expo-notifications";
import { getChatPartyState } from '../Services/stateService'
import { AUTH, FIRESTORE_DB } from "../firebaseConfig";
import { onSnapshot, orderBy, query, collection } from "firebase/firestore";

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


const AuthStack = () => {


    useEffect(() => {

        const q = query(collection(FIRESTORE_DB, 'chats'))
        onSnapshot(q, (snapshot) => {
            if(snapshot){
                console.log('Some',snapshot);
                generateNotification();
            }
        }
        );

    }, [])


    return (
        <PaperProvider theme={theme}>
            <NavigationContainer>

                <Stack.Navigator initialRouteName="SplashScreen">

                    <Stack.Screen
                        name="LoginScreen"
                        component={Login}
                        options={noHeader}
                    />
                    <Stack.Screen
                        name="RegisterScreen"
                        component={Register}
                        options={noHeader}
                    />
                    <Stack.Screen
                        name="BuildProfileScreen"
                        component={BuildProfile}
                        options={noHeader}
                    />
                    <Stack.Screen
                        name="HomeScreen"
                        component={Home}
                    />
                    <Stack.Screen
                        name="ForgotPassword"
                        component={ForgotPassword}
                    />
                    <Stack.Screen
                        name="SplashScreen"
                        component={SplashScreen}
                        options={noHeader}
                    />
                    <Stack.Screen
                        name="WorkerHomepage"
                        component={WorkerHomepage}
                        options={noHeader}

                    />
                    <Stack.Screen
                        name="CustomerHomepage"
                        component={CustomerHomepage}
                        options={noHeader}
                    />
                    <Stack.Screen
                        name="Settings"
                        component={Settings}
                        options={noHeader}
                    />
                    <Stack.Screen
                        name="ChangePasswordScreen"
                        component={ChangePassword}
                        options={noHeader}
                    />
                    <Stack.Screen
                        name="ChangeEmailScreen"
                        component={ChangeEmail}
                        options={noHeader}
                    />
                    <Stack.Screen
                        name="MapScreen"
                        component={MapScreen}
                    />
                    <Stack.Screen
                        name="WorkerProfileScreen"
                        component={Profile}
                        options={noHeader}
                    />
                    <Stack.Screen
                        name="CustomerChatScreen"
                        component={CustomerChat}
                        options={noHeader}
                    />
                    <Stack.Screen
                        name="WorkerChatScreen"
                        component={WorkerChat}
                        options={noHeader}
                    />
                    <Stack.Screen
                        name="CustomerHistoryScreen"
                        component={CustomerHistory}
                        options={noHeader}
                    />
                    <Stack.Screen
                        name="WorkerHistoryScreen"
                        component={WorkerHistory}
                        options={noHeader}
                    />
                    <Stack.Screen
                        name="ClientComplainScreen"
                        component={ClientComplain}
                        options={noHeader}
                    />
                    <Stack.Screen name="AskServiceScreen" component={AskServiceScreen} options={noHeader} />
                    <Stack.Screen name="BanScreen" component={BanScreen} options={noHeader} />
                    <Stack.Screen name="NotApprovedScreen" component={NotApprovedScreen} options={noHeader} />
                    <Stack.Screen name="WorkerBuildProfileScreen" component={WorkerBuildProfile} options={noHeader} />
                    <Stack.Screen name="CustomerActivity" component={ActivityScreen} options={noHeader} />
                </Stack.Navigator>
            </NavigationContainer>
        </PaperProvider>
    );

}


export default AuthStack;