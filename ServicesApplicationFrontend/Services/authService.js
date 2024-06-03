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
    signInWithEmailAndPassword(firebaseConfig.auth, email, password)
        .then(userCredential => {
            
            //AsyncStorage.setItem('user', JSON.stringify(userObject));
            //navigation.replace("HomeScreen");
            return {
                status: 'success',
                type: 'emailPass',
                message: 'redirecting to Homepage',
                user: userCredential
            };

        })
        .catch(err => {
            console.error(err);
            return{
                status: 'error',
                type: 'emailPass',
                message: 'redirecting to Homepage',
                user: err
            };;
        });
    //logic to do login user 
    return{
        status:"success",
        message:"Redirecting to Homepage",
        user: 'blank',
    }
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