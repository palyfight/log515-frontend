import Vue from 'vue'
import auth from './auth'

export default {
  createClientVehicule (clientId, vehiculePayload) {
    return new Promise((resolve, reject) => {
      http.post(`/v1/clients/${clientId}/vehicules`, {"vehicule": vehiculePayload})
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    })
  },

  updateVehicleDetails (clientId, vehicleId, vehiclePayload) {
    return new Promise((resolve, reject) => {
      http.patch(`/v1/clients/${clientId}/vehicules/${vehicleId}`, {"vehicule": vehiclePayload})
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    })
  },

  fetchVehicleByPhone (phoneNumber) {
    return new Promise((resolve, reject) => {
      http.get(`/v1/vehicles`, {"client_phone": phoneNumber})
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    })
  }
}
