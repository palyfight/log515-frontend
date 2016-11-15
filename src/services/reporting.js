import auth from './auth'

export default {
  getEarnings (shopId, data) {
    return new Promise((resolve, reject) => {
      http.get(`/v1/reporting/earnings/${shopId}`, data)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    });
  },

  getCustomers (shopId, data) {
    return new Promise((resolve, reject) => {
      http.get(`/v1/reporting/customers/${shopId}`, data)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    });
  },
}
