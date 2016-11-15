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
  }

  getProperties (userId) {
    return new Promise((resolve, reject) => {
      http.get(`user/${userId}/properties/`, property)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    });
  }
}
