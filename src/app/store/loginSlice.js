import { createSlice } from '@reduxjs/toolkit';
import jwtService from '../auth/services/jwtService';
import { setUserData } from './userSlice';

const initialState = {
  success: false,
  errors: [],
  loading: false,
};

const loginSlice = createSlice({
  name: 'auth/login',
  initialState,
  reducers: {
    startLoading(state) {
      state.loading = true;
    },
    loginSuccess: (state) => {
      state.loading = false;
      state.success = true;
      state.errors = [];
    },
    loginError: (state, action) => {
      state.loading = false;
      state.success = false;
      state.errors = Array.isArray(action.payload) ? action.payload : [action.payload];
    },
  },
  extraReducers: {},
});

export const submitLogin =
  ({ email, password }) =>
  async (dispatch) => {
    dispatch(startLoading());
    return jwtService
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        dispatch(setUserData(user));
        return dispatch(loginSuccess(user));
      })
      .catch((err) => dispatch(loginError(err.message)));
  };

export const { loginSuccess, loginError, startLoading } = loginSlice.actions;

export default loginSlice.reducer;
