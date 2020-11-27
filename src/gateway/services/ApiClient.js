const axios = require('axios');

class ApiClient {
  constructor() {
    this.apiHost = process.env.API_HOST;
  }

  get(endpoint) {
    const uri = `${this.apiHost}${endpoint}`;

    return axios.get(uri).then((res) => ({
      error: false,
      status: 200,
      data: res.data || {},
    })).catch((error) => ({
      error: true,
      status: error.response.status,
      statusText: error.toJSON().message,
      data: {},
    }));
  }

  post(endpoint, body) {
    const uri = `${this.apiHost}${endpoint}`;

    return axios.post(uri, body).then((res) => ({
      error: false,
      status: 200,
      data: res.data || {},
    })).catch((error) => ({
      error: true,
      status: error.response.status,
      statusText: error.toJSON().message,
      data: {},
    }));
  }
}

const apiClient = new ApiClient();

module.exports = {
  apiClient,
  ApiClient,
};
