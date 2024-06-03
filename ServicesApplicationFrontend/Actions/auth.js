import { LOGOUT, LOGIN_SUCCESS } from "./type";
import authService from "../Services/authService";

export const login = (user) => (dispatch) =>{
    return authService.Login(user.email, user.password, 'HomeScreen').then(
        (response)=>{
          console.log(response);
            if(response.status == "success") {
                console.log(response.user);
                dispatch({
                    type: LOGIN_SUCCESS,
                    payload: {user: response.user}
                });
                Promise.resolve();
                return response;
            }else{
              console.log(response);
            }
        },
        (error) => {
            const meassage = error.toString();
            Promise.reject();
            return meassage;
        }
    );
}

export const logout = () => (dispatch) => {
    return authService.logOut().then((response) => {
      if (response.status === "success") {
        dispatch({
          type: LOGOUT,
        });
        Promise.resolve();
        return response;
      }
    });
  };