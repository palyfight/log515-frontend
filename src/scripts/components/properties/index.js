import Property from '../../services/property';

export default {
  ready () {
    this.getProperties();
    this.getUserProperties();
  },

  data () {
    return {
      properties: [],
      userProperties: [],
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
      const role = localStorage.getItem('role');

      Property.getAllProperties( userId, role)
      .then((response) => {
        let properties = _.map(response.data, (property) => {
          this.properties.push({
            "id": property.idProperty,
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

    getUserProperties () {
      const userId = localStorage.getItem('userId');
      const role = localStorage.getItem('role');

      Property.getUserProperties( userId, role)
      .then((response) => {
        let properties = _.map(response.data, (property) => {
          this.userProperties.push({
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

    claimProperty ( propertyId ) {
      const userId = localStorage.getItem('userId');

      Property.claimProperty( userId, propertyId )
      .then((response) => {
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
