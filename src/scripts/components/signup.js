import auth from '../services/auth'

export default {
  ready () {
  },

  data () {
    return {
      shopSignupSubmitted: false,
      user: {
        firstName: '',
        lastName: '',
        email: '',
        password: ''
      },
      msg: '',
      error: ''
    }
  },

  methods: {
    submit () {
      this.shopSignupSubmitted = true;
      var credentials = {
        user: {
          first_name: this.user.firstName,
          last_name: this.user.lastName,
          email: this.user.email,
          password: this.user.password
        }
      }
      
      const hasErrors = this.$signupValidation.errors && this.$signupValidation.errors.length > 0;

      if (!hasErrors) {
        auth.signup(credentials)
        .then((response) => {
          router.go('/dashboard')
        })
        .catch((error) => {
          let errors = _.map(error.data.errors, (error) => {
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
