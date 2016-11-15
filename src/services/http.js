export default class Http {
  constructor () {
    this.api_url = config.api.base_url
  }

  get (path, payload, api) {
    const api_url = api || this.api_url
    return new Promise ((resolve, reject) => {
      Vue.http.get(api_url + path, payload, {headers: this.getHeaders()})
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
    })
  }

  post (path, payload, api) {
    const api_url = api || this.api_url
    const options = {headers: this.getHeaders()}
    return new Promise ((resolve, reject) => {
      Vue.http.post(api_url + path, payload, {headers: this.getHeaders()})
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
    })
  }

  put (path, payload, api) {
    const options = {headers: this.getHeaders()}
    const api_url = api || this.api_url
    return new Promise ((resolve, reject) => {
      Vue.http.put(api_url + path, payload, {headers: this.getHeaders()})
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
    })
  }

  patch (path, payload, api) {
    const options = {headers: this.getHeaders()}
    const api_url = api || this.api_url
    return new Promise ((resolve, reject) => {
      Vue.http.patch(api_url + path, payload, {headers: this.getHeaders()})
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
    })
  }

  delete (path, payload, api) {
    const options = {headers: this.getHeaders()}
    const api_url = api || this.api_url
    return new Promise ((resolve, reject) => {
      Vue.http.delete(api_url + path, payload, {headers: this.getHeaders()})
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
    })
  }

  getHeaders () {
    return {
      'Authorization': 'Bearer ' + localStorage.getItem('token'),
      'Content-Type': 'application/json'
    }
  }
};
