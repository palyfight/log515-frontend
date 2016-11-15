const SIGNUP_URL = '/v1/users/register'
const LOGIN_URL = '/v1/users/login'

export default {

  user: {
    id: null,
    authenticated: false,
    hasShops: false
  },

  login (creds) {
    return new Promise ((resolve, reject) => {
      http.post(LOGIN_URL, creds)
      .then((response) => {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user_id', response.data.user_id);
        localStorage.setItem('has_shops', response.data.has_shops);
        localStorage.setItem('shop_name', response.data.shop_name);
        this.user.authenticated = true;
        this.user.id = response.data.user_id;
        this.user.hasShops = response.data.has_shops;
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
    })
  },

  signup (creds) {
    return new Promise((resolve, reject) => {
      http.post(SIGNUP_URL, creds)
      .then((response) => {
        // Login the user
        var credentials = {
          user: {
            email: creds.user.email,
            password: creds.user.password
          }
        }

        this.login(credentials)
        .then((response) => {
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
      })
      .catch((err) => {
        reject(err)
      })
    })
  },

  logout () {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('shop_id');
    localStorage.removeItem('has_shops');
    localStorage.removeItem('shop_name');
    this.user.authenticated = false;
    this.user.id = null;
    this.user.hasShops = false;
  },

  isAuthenticated () {
    var token = localStorage.getItem('token')

    if (token) {
      this.user.authenticated = true
    } else {
      this.user.authenticated = false
    }

    return this.user.authenticated;
  },

  hasShops () {
    var hasShops = localStorage.getItem('has_shops');

    if (hasShops === "true" || hasShops === true) {
      this.user.hasShops = true;
    } else {
      this.user.hasShops = false;
    }
    return this.user.hasShops;
  },

  getUserId() {
    var user_id = localStorage.getItem('user_id')

    if (user_id) {
      this.user.id = user_id
    }

    return this.user.id
  }
}

