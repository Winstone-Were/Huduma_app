import React, { useState, useEffect } from 'react'

import { Alert, StyleSheet, View } from 'react-native';
import { Text, TextInput, Button, Switch, HelperText, Menu, Divider, ActivityIndicator } from 'react-native-paper';

import axios from 'axios';

export default function ForgotPassword({ navigation }) {

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleReset = async () => {
        setLoading(true);
        if (email == '') {
            Alert.alert('Email cannot be null');
        } else {
            axios.post('http://192.168.100.91:3000/api/resetpassword', { email })
                .then(result => {
                    Alert.alert('Reset Link has been sent successfully');
                    navigation.push('LoginScreen');
                })
                .catch(err => {
                    Alert.alert(err.error);
                })
        }
    }

    return (
        <View style={styles.container}>
            {loading ?
                (<>
                    <ActivityIndicator animating={true} />
                </>) :
                (<>
                    <View style={styles.textContainer}>
                        <Text>
                            Forgot Your Password ?
                        </Text>
                        <Text>
                            Enter Your Registered email Address Below
                        </Text>
                    </View>
                    <TextInput
                        style={{ ...styles.input, backgroundColor: "white" }}
                        value={email}
                        label='email'
                        onChangeText={(text) => setEmail(text)}
                    />

                    <Button mode='contained' style={styles.input} onPress={() => handleReset()} > Send Reset Link </Button>
                    <Button style={styles.input} onPress={() => navigation.push('LoginScreen')}> Go back to Login </Button>
                </>)}

        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", marginHorizontal: 30 },
    input: { marginVertical: 5, borderRadius: 0 },
    row: {
        alignItems: "center",
        flexDirection: "row",
        marginVertical: 20,
        justifyContent: "space-between",
    },
    textContainer: { alignContent: 'center', alignItems: 'center' }

});