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

    getProperties () {
      const userId = localStorage.getItem('userId');

      Property.getProperties( userId )
      .then((response) => {
        let properties = _.map(response.data, (property) => {
          this.properties.push({
            "id": property.id,
            "postalCode": property.postalCode,
            "nbAppartments": property.nbAppartments,
            "description" : property.description,
          });
        });
      })
      .catch((error) => {
        this.$dispatch('app-error', { title: 'Internal Error', text: 'Please communicate with our support team' });
      })
    },

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
