import auth from './auth'

export default {

  getCountries () {
    return new Promise((resolve, reject) => {
      http.get('/v1/countries')
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
    })
  },

  getRegions (country_id) {
    return new Promise((resolve, reject) => {
      http.get('/v1/countries/'+ country_id +'/regions')
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
    })
  }
}
