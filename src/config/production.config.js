var config = {
  env: 'production',
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
  shopsToHideDashboard: [25]
}

module.exports = config
