const axios = require('axios');

const FormData = require('form-data');

const { defaultFile } = require('./encodedImg');

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
      status: 500,
      statusText: error.toJSON().message,
      data: {},
    }));
  }

  getFile(endpoint) {
    const uri = `${this.apiHost}${endpoint}`;

    return axios.get(uri, { responseType: 'arraybuffer' }).then((res) => ({
      error: false,
      encoded: Buffer.from(res.data, 'binary').toString('base64'),
    })).catch(() => ({
      error: true,
      encoded: defaultFile.encoded,
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
      status: 500,
      statusText: error.toJSON().message,
      data: {},
    }));
  }

  delete(endpoint) {
    const uri = `${this.apiHost}${endpoint}`;

    return axios.delete(uri).then((res) => ({
      error: false,
      status: 200,
      data: res.data || {},
    })).catch((error) => ({
      error: true,
      status: 500,
      statusText: error.toJSON().message,
      data: {},
    }));
  }

  postMedia(endpoint, req) {
    const uri = `${this.apiHost}${endpoint}`,
      formData = new FormData();

    formData.append('photo', req.file.buffer, req.file.originalname);

    const config = {
      headers: formData.getHeaders(),
    };

    return axios.post(uri, formData, config).then((res) => ({
      error: false,
      status: 200,
      data: res.data || {},
    })).catch((error) => ({
      error: true,
      status: error.response.status,
      statusText: error.response.statusText,
      data: {},
    }));
  }
}

const apiClient = new ApiClient();

module.exports = {
  apiClient,
  ApiClient,
};
