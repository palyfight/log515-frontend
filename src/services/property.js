import Vue from 'vue'
import auth from './auth'

export default {

  getAllProperties () {
    return new Promise((resolve, reject) => {
      http.get(`/properties`)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    });
  },

  claimProperty ( userId, propertyId ) {
    return new Promise((resolve, reject) => {
      http.post(`/property/${userId}/${propertyId}/claim`)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    });
  },

  unclaimProperty ( userId, propertyId ) {
    return new Promise((resolve, reject) => {
      http.post(`/property/${userId}/${propertyId}/unclaim`)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    });
  },

  saveProperty (userId, property) {
    return new Promise((resolve, reject) => {
      http.post(`/property/save`, property)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    });
  },

  getUserProperties (userId, role) {
    return new Promise((resolve, reject) => {
      http.get(`/user/${userId}/${role}/property`)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    });
  },

  getProperty (propertyId) {
    return new Promise((resolve, reject) => {
      http.get(`/property/one/${propertyId}`)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    });
  },

  removeOccupant (userId, propertyId) {
    console.log(userId);
    console.log(propertyId);
    return new Promise((resolve, reject) => {
      http.get(`/property/${userId}/${propertyId}/unclaim`)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    });
  }
}
