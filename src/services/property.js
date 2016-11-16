import Vue from 'vue'
import auth from './auth'

export default {
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
      http.get(`/properties`)
      .then((response) => {
        console.log(response);
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    });
  }
}
