import authService from '../../services/auth'

export default {
  ready() {
  },

  data () {
    return {
      shop_name: localStorage.getItem('shop_name') || "Welcome to KarZen"
    }
  },

  methods: {
  	logout () {
      authService.logout();
      this.$route.router.go('/login');
    }
  }
}
