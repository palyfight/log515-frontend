const env = process.env.APP_ENV || 'development'

var config = {
  development: require('./development.config'),
  staging: require('./staging.config'),
  production: require('./production.config')
}

module.exports = config[env]

