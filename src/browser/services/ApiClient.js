import axios from 'axios';

class ApiClient {
  static delete(endpoint) {
    return axios.delete(endpoint);
  }

  static post(endpoint, data) {
    return axios.post(endpoint, data);
  }

  static postMedia(endpoint, formData) {
    return axios.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  static get(endpoint) {
    return axios.get(endpoint);
  }
}

export default ApiClient;
