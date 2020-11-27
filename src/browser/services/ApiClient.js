import axios from 'axios';

class ApiClient {
  static post(endpoint, data) {
    return axios.post(endpoint, data);
  }

  static get(endpoint) {
    return axios.get(endpoint);
  }
}

export default ApiClient;
