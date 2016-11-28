import authService from '../../services/auth'

export default {
  ready() {
    if(localStorage.getItem('role') == 'pro') {
      this.main_path = 'admin';
    }
    else {
      this.main_path = 'tenant';
    }
  },

  data () {
    return {
      main_path: 'admin',
      shop_name: localStorage.getItem('shop_name') || "Communication"
    }
  },

  methods: {
  	logout () {
      authService.logout();
      this.$route.router.go('/login');
    }
  }
}
