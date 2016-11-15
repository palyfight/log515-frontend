import Vue from 'vue'
import auth from './auth'

export default {
  getInvoice (shopId, invoiceId) {
    return new Promise((resolve, reject) => {
      http.get(`/v1/shops/${shopId}/invoices/${invoiceId}`)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    })
  },

  getInvoices (shopId) {
    return new Promise((resolve, reject) => {
      http.get(`/v1/shops/${shopId}/invoices`)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    })
  },

  createInvoice (shopId, invoicePayload) {
    return new Promise((resolve, reject) => {
      http.post(`/v1/shops/${shopId}/invoices`, invoicePayload)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    })
  },

  updateInvoice (shopId, invoiceId, invoicePayload) {
    return new Promise((resolve, reject) => {
      http.put(`/v1/shops/${shopId}/invoices/${invoiceId}`, invoicePayload)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    })
  },

  deleteInvoice (shopId, invoiceId) {
    return new Promise((resolve, reject) => {
      http.delete(`/v1/shops/${shopId}/invoices/${invoiceId}`)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    })
  },

  deleteInvoiceLine (shopId, invoiceId, invoiceLineId) {
    return new Promise((resolve, reject) => {
      http.delete(`/v1/shops/${shopId}/invoices/${invoiceId}/line/${invoiceLineId}`)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    })
  }
}
