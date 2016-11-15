import auth from './auth'

export default {

  getMakers () {
    return new Promise((resolve, reject) => {
      http.get('/v1/vehicules/makes')
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
    })
  },

  getModels (maker_id) {
    return new Promise((resolve, reject) => {
      http.get(`/v1/vehicules/makes/${maker_id}/models`)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
    })
  },

  getYears (model_id) {
    return new Promise((resolve, reject) => {
      http.get(`/v1/vehicules/models/${model_id}/years`)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
    })
  },

  getTrims (model_id, year) {
    return new Promise((resolve, reject) => {
      http.get(`/v1/vehicules/models/${model_id}/years/${year}/trims`)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
    })
  }

}
