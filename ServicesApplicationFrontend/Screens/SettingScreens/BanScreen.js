import { View, Text } from 'react-native';
import React from 'react';
import { Button } from 'react-native-paper';

export default function BanScreen({navigation}) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text> You've been banned </Text>
            <Button onPress={()=> navigation.replace("LoginScreen")}> Go Back </Button>
        </View>
    )
}