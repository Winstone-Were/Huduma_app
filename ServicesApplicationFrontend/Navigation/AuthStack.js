
import React from "react";
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
import * as Notifications from 'expo-notifications';
import expoPushTokenApi from "../notifications/expoPushToken";
import { getAuth } from 'firebase/auth';
import { useRef, useEffect } from "react";

const Stack = createNativeStackNavigator();
const noHeader = { headerShown: false };

const theme = {
    ...DefaultTheme,
    roundness: 0,
    colors: {
        ...DefaultTheme.colors,
        primary: "#FF0000",
        primaryContainer: "#7FAF73",
        secondary: "#00FF00",
        secondaryContainer: "#FFFF00",
        tertiary: "#800080",
        tertiaryContainer: "#FFA500",
        surface: "#FFC0CB",
        surfaceVariant: "#008080",
        surfaceDisabled: "#808080",
        background: "#FFFFFF",
        error: "#A52A2A",
        errorContainer: "#808080",
        onPrimary: "#00FFFF",
        onPrimaryContainer: "#FFFFFF",
        onSecondary: "#00FF00",
        onSecondaryContainer: "#808000",
        onTertiary: "#800000",
        onTertiaryContainer: "#000080",
        onSurface: "#C0C0C0",
        onSurfaceVariant: "#FFD700",
        onSurfaceDisabled: "#808080",
        onError: "#4B0082",
        onErrorContainer: "#FF7F50",
        onBackground: "#F5F5DC",
        outline: "#CD853F",
        outlineVariant: "#708090",
        inverseSurface: "#7FFFD4",
        inverseOnSurface: "#BDB76B",
        inversePrimary: "#DA70D6",
        shadow: "#E6E6FA",
        scrim: "#D8BFD8",
        backdrop: "#808080",
    },

};
async function registerForPushNotificationsAsync() {
    let token;
  
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
  
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  
    return token;
  }
const AuthStack = () => {
    const auth = getAuth();
    const responseListener = useRef(); // Firebase Auth instance

    useEffect(() => {
        const registerPushToken = async () => {
            try {
                const token = await registerForPushNotificationsAsync();
                const user = auth.currentUser;
                if (user && token) {
                    await expoPushTokenApi.register(token, user.uid);
                }
            } catch (err) {
                console.error('Failed to register for push notifications:', err);
            }
        };

        registerPushToken();

        //handler
        registerForPushNotificationsAsync()
            .then(token => expoPushTokenApi.register(token));

        // Works when app is foregrounded, backgrounded, or killed
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log('--- notification tapped ---');
            console.log(response);
            console.log('------');
        });

        // Unsubscribe from events
        return () => {
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);
    return (

        <PaperProvider theme={DefaultTheme}>
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
                </Stack.Navigator>
            </NavigationContainer>
        </PaperProvider>
    );

}


export default AuthStack;