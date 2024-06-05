import AsyncStorage from "@react-native-async-storage/async-storage";

const LoadProfile = async () =>{ 
    let userProfile;
    AsyncStorage.getItem('user')
        .then(resp=>{
            return {
                status: 'success',
                type: 'emailPass',
                message: 'redirecting to Homepage',
                user: JSON.parse(resp)
            };
        })
        .catch(err=>{
            return {
                status: 'error',
                type: 'emailPass',
                message: 'redirecting to Homepage',
                error: err
            };
        })
}

export default {LoadProfile};