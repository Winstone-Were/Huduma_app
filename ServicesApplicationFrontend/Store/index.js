import {createStore, applyMiddleware} from 'redux';
import {thunk} from 'redux-thunk';

import auth from  '../Reducers/auth';

const middlware = [thunk];

const store = createStore(auth, applyMiddleware(...middlware));

export default store;