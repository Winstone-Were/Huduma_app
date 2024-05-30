//import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import firebaseConfig from "../firebaseConfig";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendEmailVerification,
    initializeAuth,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = async (email, password, navigation) => {
    console.log('I get called');
    signInWithEmailAndPassword(firebaseConfig.auth, email, password)
        .then(userCredential => {      
            let userObject = {
                status: 'success',
                type: 'emailPass',
                message: 'redirecting to Homepage',
                user: userCredential}
            AsyncStorage.setItem('user', JSON.stringify(userObject));
            navigation.push("HomeScreen");
        })
        .catch(err => {
            console.error(err);
        });
    //logic to do login user 
    /*return{
        status:"success",
        message:"Redirecting to Homepage",
        user: username,
    }*/
}

const register = async (email, password) => {
    createUserWithEmailAndPassword(firebaseConfig.auth, email, password)
        .then(userCredential => {
            sendEmailVerification(firebaseConfig.auth.currentUser)
                .then(() => {
                    return {
                        status: 'success',
                        message: 'Email Verified'
                    }
                })
                .catch(err => {
                    console.error(err);
                    return {
                        status: 'error',
                        message: err
                    }
                })
        })
}

const logOut = async () => {
    AsyncStorage.clear();
    return {
        status: "success",
        message: "You are logged out",
    };
};

export default {
    Login,
    register,
    logOut
}