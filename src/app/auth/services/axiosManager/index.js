import axios from 'axios';

class AxiosManagerService {
  #instances = new Map();

  #mappedHandlers = new Map();

  bindHttpErrorsHandlers(mappedHandlers) {
    this.#mappedHandlers = mappedHandlers;
  }

  getInstance(host, path) {
    const baseURL = `${host}/${path}`;

    if (!this.#instances.has(host)) {
      const instance = axios.create({ baseURL });
      this.#instances.set(host, instance);
      return instance;
    }

    const parentInstance = this.#instances.get(host);
    const instance = axios.create({ baseURL });

    instance.defaults.headers = parentInstance.defaults.headers;
    this.setInterceptors(instance);

    return instance;
  }

  setInterceptors(axiosInstance) {
    axiosInstance.interceptors.response.use(
      (res) => res,
      (err) => {
        this.#mappedHandlers.get(err.response?.status)?.();
        throw err;
      }
    );
  }

  stringifyError = (err) => err.response?.data?.error || err.message;
}

// eslint-disable-next-line import/prefer-default-export
export const AxiosManager = new AxiosManagerService();
