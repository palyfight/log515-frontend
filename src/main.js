window.Vue = require('vue');
window.VueRouter = require('vue-router');
window.VueResource = require('vue-resource');
window._ = require('lodash');
window.numeral = require('numeral');

import VueValidator from 'vue-validator'
import VueI18n from 'vue-i18n'
import locales from './locale.js'

Vue.use(VueResource) 
Vue.use(VueRouter)
Vue.use(VueValidator)
Vue.use(VueI18n, {
  lang: 'en',
  locales: locales
});

// Filters
Vue.filter('currencyDisplay', {
  read: function(val, symbol) {
    if (!val) {
      return '-';
    }

    return numeral(val, 10).format('0,00.00$');
  }
});

Vue.validator('email', function (val) {
  return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(val)
});

// App configuration
window.config = require('./config')

// Configure router
import Router from './routes'
// Set a global VueRouter
window.router = new Router().getRouter()

// Configue HTTP
import Http from './services/http'
// Set global Http
window.http = new Http()

// Components
import App from './App.vue'
router.start(App, 'app')
