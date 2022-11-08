/* eslint import/no-extraneous-dependencies: off */
import { createSlice } from '@reduxjs/toolkit';
import history from '@history';
import { setInitialSettings } from 'app/store/fuse/settingsSlice';

export const setUserData = (user) => async (dispatch, getState) => {
  const adaptedUser = {
    role: [user.role],
    data: {
      id: user.id,
      displayName: user.fullName,
      email: user.email,
      photoURL: user.photo,
      clientKey: user.clientKey,
      shortcuts: [],
      twoFactorEnabled: user.twoFactorEnabled,
      twoFactorVerified: user.twoFactorVerified,
    },
  };

  dispatch(setUser(adaptedUser));
};

export const logoutUser = () => async (dispatch, getState) => {
  const { user } = getState();

  if (!user.role || user.role.length === 0) {
    return null;
  }

  history.push({
    pathname: '/',
  });

  dispatch(setInitialSettings());

  return dispatch(userLoggedOut());
};

const initialState = {
  role: [],
  data: {
    displayName: '',
    photoURL: '',
    email: '',
    shortcuts: [],
  },
};

const userSlice = createSlice({
  name: 'auth/user',
  initialState,
  reducers: {
    setUser: (state, action) => action.payload,
    userLoggedOut: (state, action) => initialState,
  },
  extraReducers: {},
});

export const { setUser, userLoggedOut } = userSlice.actions;

export const selectUser = ({ user }) => user;

export default userSlice.reducer;
