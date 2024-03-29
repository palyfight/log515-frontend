const LOGIN_URL = '/login'

export default {

  user: {
    id: null,
    authenticated: false,
  },

  login (creds) {
    return new Promise ((resolve, reject) => {
      http.post(LOGIN_URL + '/' + creds.user.email + '/' + creds.user.password, creds)
      .then((response) => {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.userId);
        localStorage.setItem('username', response.data.username);
        localStorage.setItem('role', response.data.role);
        localStorage.setItem('phone', response.data.phone);
        this.user.authenticated = true;
        this.user.id = response.data.userId;
        this.user.hasShops = response.data.has_shops;
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
    })
  },

  signup (creds) {
    console.log(creds);
    return new Promise((resolve, reject) => {
      http.post(`/signup/${creds.user.username}/${creds.user.password}/${creds.user.phone}/${creds.user.role}/${creds.user.email}`)
      .then((response) => {
        var credentials = {
          user: {
            email: creds.user.username,
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
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('phone');
    localStorage.removeItem('role');
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

  getUserId() {
    var userId = localStorage.getItem('userId')

    if (userId) {
      this.user.id = userId
    }

    return this.user.id
  }
}
