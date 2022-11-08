import FuseUtils from '@fuse/utils/FuseUtils';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { AxiosManager } from '../axiosManager';
/* eslint-disable camelcase */

class JwtService extends FuseUtils.EventEmitter {
  constructor() {
    super();
    this.axios = AxiosManager.getInstance(process.env.REACT_APP_ADMIN_API_URL, 'api/admin');
    AxiosManager.setInterceptors(this.axios);
  }

  init() {
    this.handleAuthentication();
  }

  handleAuthentication = () => {
    const access_token = this.getAccessToken();
    if (!access_token) {
      this.emit('onNoAccessToken');

      return;
    }

    if (this.isAuthTokenValid(access_token)) {
      this.setSession(access_token);
      this.emit('onAutoLogin', true);
    } else {
      this.setSession(null);
      this.emit('onAutoLogout', 'access_token expired');
    }
  };

  signInWithEmailAndPassword = async (login, password) => {
    try {
      const {
        data: { data },
      } = await this.axios.post('/auth/signIn', { login, password });
      this.setSession(data.access_token);
      this.setRefresh(data.refresh_token);

      return data.user;
    } catch (error) {
      throw new Error(console.log(error));
    }
  };

  signIn2faCode = async (model) => {
    try {
      const {
        data: { data },
      } = await this.axios.post('/auth/2fa/signIn', model);
      this.setSession(data.access_token);
      this.setRefresh(data.refresh_token);

      return data.user;
    } catch (error) {
      throw new Error(console.log(error));
    }
  };

  signInWithToken = async () => {
    try {
      const {
        data: { data },
      } = await this.axios.post('/auth/access-token', {
        accessToken: this.getAccessToken(),
      });

      return data.user;
    } catch (error) {
      this.logout();
      throw new Error('Failed to login with token.');
    }
  };

  setSession = (access_token) => {
    if (access_token) {
      localStorage.setItem('jwt_access_token', access_token);
      axios.defaults.headers.common.Authorization = `Bearer ${access_token}`;
    } else {
      localStorage.removeItem('jwt_access_token');
      delete axios.defaults.headers.common.Authorization;
    }
  };

  logout = () => {
    this.setSession(null);
    this.setRefresh(null);
    this.emit('onLogout', 'Logged out');
  };

  setRefresh = (refreshToken) => {
    if (refreshToken) {
      localStorage.setItem('jwt_refresh_token', refreshToken);
      return;
    }
    localStorage.removeItem('jwt_refresh_token');
  };

  isAuthTokenValid = (access_token) => {
    if (!access_token) {
      return false;
    }
    const decoded = jwtDecode(access_token);
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      console.warn('access token expired');
      return false;
    }

    return true;
  };

  getAccessToken = () => {
    return window.localStorage.getItem('jwt_access_token');
  };

  getRefreshToken = () => {
    return window.localStorage.getItem('jwt_refresh_token');
  };
}

const instance = new JwtService();

export default instance;
