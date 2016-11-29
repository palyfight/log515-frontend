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
          username: this.user.username,
          password: this.user.password,
          email: this.user.email,
          phone: this.user.phone,
          role: this.user.role
        }
      }

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
    },

    onTouched: function (touched) {
      this.$broadcast('error-messages', []);
    }
  }
}
