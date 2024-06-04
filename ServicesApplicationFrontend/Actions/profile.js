import LoadProfile from '../Services/stateService';

export const loadUserProfileAction = () => (dispatch)=> {
    return LoadProfile()
}