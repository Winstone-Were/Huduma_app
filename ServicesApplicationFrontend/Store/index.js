import {createStore, applyMiddleware} from 'redux';
import {thunk} from 'redux-thunk';

import authReducer from  '../Reducers/auth';

const middlware = [thunk];

const store = createStore(authReducer, applyMiddleware(...middlware));

export default store;