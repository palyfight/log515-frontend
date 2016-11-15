import auth from './auth'

export default {

  getShopById (shopId) {
    const userId = auth.getUserId();

    return new Promise((resolve, reject) => {
      http.get(`/v1/users/${userId}/shops/${shopId}`, '')
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
    });
  },

  createShop (data) {
    const userId = auth.getUserId();

    return new Promise((resolve, reject) => {
      http.post(`/v1/users/${userId}/shops`, data)
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
    });
  },

  updateShop (shopId, data) {
    const userId = auth.getUserId()

    return new Promise((resolve, reject) => {
      http.put(`/v1/users/${userId}/shops/${shopId}`, data)
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
    });
  },

  updateShopLegal (shopId, data) {
    const userId = auth.getUserId();

    return new Promise((resolve, reject) => {
      http.post(`/v1/users/${userId}/shops/${shopId}/legal`, data)
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
    });
  },

  getShopLegal (shopId) {
    const userId = auth.getUserId();

    return new Promise((resolve, reject) => {
      http.get(`/v1/users/${userId}/shops/${shopId}/legal`)
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
    });
  },

  changeShopLogo (shopId, data) {
    const userId = auth.getUserId()

    return new Promise((resolve, reject) => {
      http.post(`/v1/users/${userId}/shops/${shopId}/metadata`, data)
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
    });
  },

  getShopLogo (shopId) {
    const userId = auth.getUserId();

    return new Promise((resolve, reject) => {
      http.get(`/v1/users/${userId}/shops/${shopId}/metadata`)
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
    });
  }
}
