//import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";

const logIn = async (user) => {

    console.log(user);

    try {

        const response = await axios.post('https://vovserver.onrender.com/api/signin', user);

        console.log((await response).data);

        let userData = (await response).data;

        return {
            status: 'success',
            message: 'redirecting to Homepage',
            user: userData
        }
    } catch (err) {
        console.log(err.code);
        console.error(`Error from Auth Service ${err}`);
    }


    //logic to do login user 
    /*return{
        status:"success",
        message:"Redirecting to Homepage",
        user: username,
    }*/
}

const signUp = async (user) => {
    try {
        const response = await axios.post('https://vovserver.onrender.com/api/signup', user);
        console.log(response);
    } catch (error) {
        console.error(`Error Code ${error.code}`, error.message);
    }
}

/*const logOut = async () => {
    AsyncStorage.clear();
    return {
        status: "success",
        message: "You are logged out",
    };
};*/

export default {
    logIn,
    signUp
}