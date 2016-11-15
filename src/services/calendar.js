import auth from './auth'

export default class Calendar {

  constructor () {
    this.api_calendar_url = config.api.calendar;
  }

  getAppointment ( shopId, appointmentId ) {
    return new Promise((resolve, reject) => {
      http.get(`/${shopId}/getEvents/${appointmentId}`, {}, this.api_calendar_url)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
    })
  }

  getMonthAppointments ( shopId, month, year ) {
    return new Promise((resolve, reject) => {
      http.get(`/${shopId}/getEvents/${month}/${year}`, {}, this.api_calendar_url)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
    })
  }

  createAppointment ( shopId, appointmentPayload ) {
    return new Promise((resolve, reject) => {
      http.post('/save', appointmentPayload, this.api_calendar_url)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
    })
  }

  updateAppointment ( shopId, appointmentPayload ) {
    return new Promise((resolve, reject) => {
      http.put('/', appointmentPayload, this.api_calendar_url)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
    })
  }

  deleteAppointment ( shopId, appointmentPayload ) {
    return new Promise((resolve, reject) => {
      http.delete('/', appointmentPayload, this.api_calendar_url)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
    })
  }
}
