import Property from '../../services/property';

export default {
  ready () {
  },

  data () {
    return {
      properties: [],
      property: {
        address: '',
        postalCode: '',
        nbAppartments: '',
        description: ''
      },
    }
  },

  methods: {
    addProperty () {
      const userId = localStorage.getItem('userId')

      var property = {
        address: this.property.address,
        postalCode: this.property.postalCode,
        nbAppartments: this.property.nbAppartments,
        description: this.property.description
      }

      Property.saveProperty(userId, property)
      .then((response) => {
        this.properties.push(property);
      })
      .catch((error) => {
        this.$dispatch('app-error', { title: 'Internal Error', text: 'Please communicate with our support team' });
      })
    }
  }
}
