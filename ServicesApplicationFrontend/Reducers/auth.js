
import { LOGIN_SUCCESS, REGISTER_SUCCESS, LOGOUT } from "../Actions/type";

const initialState = {isLoggedIn: false, user: null};

export default auth = ( state = initialState, action)=>{
    const {type, payload} = action;
    switch(type){
        case LOGIN_SUCCESS:
            return {
                ...state,
                isLoggedIn: true,
                user:payload.user
            };
        case LOGOUT:
            return {
                ...state,
                isLoggedIn: false,
                user: null
            };
        default:
            return state;
    }
};