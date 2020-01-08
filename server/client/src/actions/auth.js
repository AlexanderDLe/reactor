import axios from 'axios';
import { AUTH_SUCCESS, AUTH_FAIL, LOGOUT_USER } from './types';
import { setAlert } from './alert';

export const fetchUser = () => async dispatch => {
    const response = await axios.get('/api/current_user');
    if (response.data) {
        console.log('User is logged in.');
        dispatch({ type: AUTH_SUCCESS, payload: response.data });
    } else {
        console.log('No user logged in.');
        dispatch({ type: AUTH_FAIL });
    }
};

export const logoutUser = () => async dispatch => {
    axios.get('/api/logout');
    dispatch({ type: LOGOUT_USER });
};

export const loginUser = data => async dispatch => {
    console.log('Login User action creator reached.');
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    const { email, password } = data;
    const body = JSON.stringify({ email, password });
    try {
        await axios.post('/api/login', body, config);
        dispatch(fetchUser());
    } catch (error) {
        dispatch({ type: AUTH_FAIL });
        dispatch(setAlert('Invalid Credentials.'));
    }
};

export const registerUser = data => async dispatch => {
    console.log('Register User action creator reached.');
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    const { email, username, password } = data;
    const body = JSON.stringify({ username, email, password });
    try {
        await axios.post('/api/register', body, config);
        console.log('Registration Success');
        dispatch(loginUser(data));
    } catch (error) {
        dispatch(setAlert('Registration Failed.'));
    }
};