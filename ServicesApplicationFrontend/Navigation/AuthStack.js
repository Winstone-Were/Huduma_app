
import React from "react";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MD2LightTheme as DefaultTheme, MD3DarkTheme, PaperProvider } from "react-native-paper";

import Login from "../Screens/Login";
import Register from "../Screens/Register";
import BuildProfile from "../Screens/BuildProfile";
import Home from "../Screens/Home";

const Stack = createNativeStackNavigator();
const noHeader = { headerShown: false };

const AuthStack = () => {
    return (
        <PaperProvider>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="LoginScreen">
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
                </Stack.Navigator>
            </NavigationContainer>
        </PaperProvider>
    );

}


export default AuthStack;