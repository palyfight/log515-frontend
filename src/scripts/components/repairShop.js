import userService from '../services/user'

export default {

  init () {
    userService.getShops()
    .then((response) => {
      if (response.data.length === 0) {
        router.go('/admin/shops/new')
      }
    })
    .catch((error) => {
      console.log(error)
    })
  },

  methods: {
  }
}
