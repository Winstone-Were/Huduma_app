import LoadProfile from '../Services/stateService';
import { LOADPROFILE_SUCCESS } from './type';

export const loadUserProfileAction = () => (dispatch)=> {
    return LoadProfile.LoadProfile()
        .then(res=>{
            dispatch({
                type: LOADPROFILE_SUCCESS,
                payload: {user: res}
            })
            Promise.resolve();
            return res;
        })
        .catch(err=>{
            const meassage = error.toString();
            Promise.reject();
            return err;
        })
    
}