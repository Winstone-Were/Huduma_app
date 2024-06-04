import AsyncStorage from "@react-native-async-storage/async-storage";

const LoadProfile = async () =>{ 
    let userProfile;
    userProfile = await (JSON.parse(AsyncStorage.getItem('user')));
    return userProfile;
}

export default {LoadProfile};