
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const register = async (pushToken) => {
    try {
        const user = JSON.parse(await AsyncStorage.getItem('user')); //need to get user from db
        const uid = user.uid;

        console.log('Sending push token registration:', { token: pushToken, uid });
        await axios.post('http://172.20.10.13:3000/api/expoPushTokens', { token: pushToken, uid });
    } catch (error) {
        console.error('Error registering push token:', error.response.data);
    }
};

export default {
    register,
};
