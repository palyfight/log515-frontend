import Property from '../../services/property';

export default {
  ready () {
    this.getUserProperties();
  },

  data () {
    return {
      properties: [],
      property: {
        id: '',
        address: '',
        postalCode: '',
        nbAppartments: '',
        description: ''
      },
    }
  },

  methods: {

    getUserProperties () {
      const userId = localStorage.getItem('userId');
      const role = localStorage.getItem('role');

      Property.getUserProperties( userId, role)
      .then((response) => {
        let properties = _.map(response.data, (property) => {
          this.properties.push({
            "id": property.idProperty,
            "address": property.address,
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

    unclaimProperty ( propertyId ) {
      const userId = localStorage.getItem('userId');

      Property.unclaimProperty( userId, propertyId )
      .then((response) => {
        console.log(response);
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
