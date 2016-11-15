import userService from '../services/user'
import Sidebar from './app/Sidebar.vue';
import Header from './app/Header.vue';

export default {
  components: {
    'sidebar': Sidebar,
    'nav-header': Header
  },

  init () {
    userService.getShops()
    .then((response) => {
      if (response.data.length === 0) {
        router.go('/admin/shops/new')
        return;
      }

      if (localStorage.getItem('shop_id') === null) {
        localStorage.setItem('shop_id', response.data[0].id);
      }
    })
    .catch((error) => {
      console.log(error)
    })
  },

  methods: {
  }
}
