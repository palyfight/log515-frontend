import Vue from 'vue'
import auth from './auth'

export default {

  getShops () {
    const user_id = auth.getUserId()

    return new Promise((resolve, reject) => {
      http.get('/v1/users/'+ user_id + '/shops')
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
    })
  },

  addUser (clientPayload) {
    return new Promise((resolve, reject) => {
      http.post('/v1/users', clientPayload)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(response)
      })
    })

  }
}
