import Vue from 'vue'
import auth from './auth'

export default {
  saveProperty (shopId, property) {
    return new Promise((resolve, reject) => {
      http.get(`/property/save`)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    });
  }
}
