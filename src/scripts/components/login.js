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
    submit () {
      this.shopLoginSubmitted = true;
      var credentials = {
        user: {
          email: this.user.email,
          password: this.user.password
        }
      }
      
      const hasErrors = this.$loginValidation.errors && this.$loginValidation.errors.length > 0;

      if (!hasErrors) {
        auth.login(credentials)
        .then((response) => {
          router.go('/dashboard')
        })
        .catch((error) => {
          errors = _.map(error.data.errors, (error) => {
            return error.message;
          });
          this.$broadcast('error-messages', errors);
        });
      }
    },

    onTouched: function (touched) {
      this.$broadcast('error-messages', []);
    }
  }
}

