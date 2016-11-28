import auth from '../services/auth'

export default {
  ready () {
  },

  data () {
    return {
      shopLoginSubmitted: false,
      user: {
        email: '',
        password: ''
      },
      error: ''
    }
  },

  methods: {
    logout () {
      auth.logout();
      this.$route.router.go('/login');
    },

    submit () {
      this.shopLoginSubmitted = true;
      var credentials = {
        user: {
          email: this.user.email,
          password: this.user.password
        }
      }

      auth.login(credentials)
      .then((response) => {
        if( response.data.role == 'pro') {
          router.go('/dashboard')
        }
        else {
          router.go('/tenant/dashboard')
        }
      })
      .catch((error) => {
        errors = _.map(error.data.errors, (error) => {
          return error.message;
        });
        this.$broadcast('error-messages', errors);
      });
    },

    onTouched: function (touched) {
      this.$broadcast('error-messages', []);
    }
  }
}
