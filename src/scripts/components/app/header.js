import authService from '../../services/auth'

export default {
  ready() {
  },

  data () {
    return {
      username: localStorage.getItem('username') || "Bonjour"
    }
  },

  methods: {
    logout () {
      authService.logout();
      this.$route.router.go('/login');
    }
  }
}
