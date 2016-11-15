import Vue from 'vue'
import auth from './auth'

export default {
  getCustomer (shopId, customerId) {
    return new Promise((resolve, reject) => {
      http.get(`/v1/shops/${shopId}/clients/${customerId}`)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    });
  },

  findOrCreateUserByPhone (shopId, customerPayload) {
    return new Promise((resolve, reject) => {
      http.post(`/v1/shops/${shopId}/clients/create_by_phone`, customerPayload)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    });
  },

  getCustomers (shopId) {
    return new Promise((resolve, reject) => {
      http.get(`/v1/shops/${shopId}/clients`)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    });
  },

  createCustomer (shopId, clientPayload) {
    return new Promise((resolve, reject) => {
      http.post(`/v1/shops/${shopId}/clients`, clientPayload)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
    });
  },

  getClientVehicules (clientId) {
    return new Promise((resolve, reject) => {
      http.get(`/v1/clients/${clientId}/vehicules`)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    });
  },

  updateClient (shopId, clientId, clientPayload) {
    return new Promise((resolve, reject) => {
      http.put(`/v1/shops/${shopId}/clients/${clientId}`, clientPayload)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    });
  }
}
