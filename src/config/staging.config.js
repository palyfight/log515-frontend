var config = {
  env: 'staging',
  api: {
    base_url: '',
    calendar: '',
    defaultRequest: {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  },
  app: {
    base_url: ''
  },
  debug: true,
  shopsToHideDashboard: []
}

module.exports = config
