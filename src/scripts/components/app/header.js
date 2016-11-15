import authService from '../../services/auth'

export default {
  ready() {
  },

  data () {
    return {
    }
  },

  methods: {
    logout () {
      authService.logout();
      this.$route.router.go('/login');
    }
  }
}
