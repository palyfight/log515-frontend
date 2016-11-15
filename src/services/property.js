import Vue from 'vue'
import auth from './auth'

export default {
  saveProperty (shopId, property) {
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
}
