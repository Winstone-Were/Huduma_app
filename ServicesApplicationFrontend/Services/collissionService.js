//Try to ensure 2 workers cant accept the same job
// This will check the accepted jobs id.split("::")[1] which is the clients ID
//If that exists return true meaning theres a collission 

import { collection,getDocs,query,where} from "firebase/firestore";
import { FIRESTORE_DB } from "../firebaseConfig";

export const CheckCollission = async (client_id) =>{
    const RequestsCollection = collection(FIRESTORE_DB,'AcceptedRequests')
    const q = query(RequestsCollection,where("uid", "==", client_id));
    const qSnapShot = await getDocs(q);
    if(qSnapShot.empty){
        return false;
    }else{
        return true;
    }
}

export const CheckAskService = async(client_id) => {
    const RequestsCollection = collection(FIRESTORE_DB,'ServiceRequest')
    const q = query(RequestsCollection,where("uid", "==", client_id));
    const qSnapShot = await getDocs(q);
    if(qSnapShot.empty){
        return false;
    }else{
        return true;
    }
}